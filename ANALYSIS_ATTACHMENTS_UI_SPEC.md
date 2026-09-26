# Deep Analysis: Chat File and Image Attachments UI Spec

**Status:** Proposed for review  
**Scope:** Frontend integration of file/image attachments in Syncfusion Code Studio chat  
**Target:** `apps/syncfusion-code` chat application  
**Estimated Effort:** 5–7 sprints (6 implementation slices + backend verification)

---

## What This Spec Is

This is a **frontend architecture specification** for adding file and image uploads to the chat composer. It defines:

1. **What users see** — File picker, upload states, chips, errors
2. **What the API contract is** — Request shape, response shape, limits
3. **How to build it step-by-step** — 7 focused implementation slices
4. **How to test it** — Unit, component, integration, and backend contract tests
5. **What NOT to do** — Security boundaries, authentication, scope limits

---

## The Feature in Plain English

### User Experience

```
1. User clicks "+" in chat composer
2. Selects "Files" from quick-actions menu
3. Native file picker opens (multi-select allowed)
4. User selects 1–5 files (images or code/text)
5. Files validate locally:
   ✗ Empty files → rejected
   ✗ Images > 50 MB → rejected
   ✗ Code files > 5 MB → rejected
   ✗ Unsupported MIME → rejected

6. Valid files upload one by one
7. Each file shows:
   - Uploading: progress spinner + filename
   - Uploaded: thumbnail + filename + remove button
   - Error: error text + dismiss button
   - Warning: small icon + tooltip (image not supported by model)

8. User types message + clicks Send
9. Chat sends message with attachment IDs
10. Server processes both the text and the file references
11. AI sees the files and can answer questions about them
```

### Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Max attachments per message | 5 | Keep prompt manageable, avoid token waste |
| Max files in one upload batch | 10 | Prevent browser UI freezing |
| Max image size | 50 MB | Vision model limits |
| Max code/text file size | 5 MB | Reasonable for code review context |
| Allowed types | 7 images + 13 code types + 4 structured formats | Explicitly vetted; other types rejected |

---

## How It Works: Request/Response Flow

### 1. Upload Endpoint

**POST** `/v1/attachments`  
**Content-Type:** `multipart/form-data`

**Request:**
```ts
FormData {
  file: File                          // First file
  file: File                          // Second file (optional)
  modelName?: string                  // e.g., "claude-3-5-sonnet"
  isSupportImages?: boolean           // true if model can see images
  purpose?: "image" | "file"          // Hint for backend processing
}
```

**Response (HTTP 200):**
```ts
interface UploadResponse {
  attachments: [
    {
      filename: "schema.sql",
      ok: true,
      attachment: {
        attachmentId: "att_001",        // Server-issued stable ID
        kind: "file",
        filename: "schema.sql",
        mimeType: "application/sql",
        sizeBytes: 2048,
        sha256: "abc123...",
        url: "https://s3.../att_001.sql?sig=...",
        previewUrl: null,               // Only for images
        expiresAt: "2025-02-01T...",
        uploadedAt: "2025-01-15T...",
        warning: null,
        visionWarning: null,            // Only if model can't see code
      },
      error: null,
      warning: null,
    },
    {
      filename: "app-screenshot.png",
      ok: true,
      attachment: {
        attachmentId: "att_002",
        kind: "image",
        mimeType: "image/png",
        sizeBytes: 1048576,
        sha256: "def456...",
        width: 1920,
        height: 1080,
        url: "https://s3.../att_002.png?sig=...",
        previewUrl: "https://s3.../att_002-thumb.webp?sig=...",
        warning: null,
      },
    },
    {
      filename: "large-log.txt",
      ok: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "File exceeds 5 MB limit",
      },
    }
  ]
}
```

**Partial success is OK** — Keep successful uploads, show error for failed ones.

---

### 2. Send Message with Attachments

**POST** `/v1/runs`

**Request:**
```ts
{
  input: {
    messages: [
      {
        role: "human",
        content: "Review the attached files.",
        attachmentIds: ["att_001", "att_002"],  // ← New field
      }
    ]
  }
}
```

**What the server does:**
1. Validate each `attachmentId` exists and is owned by this user
2. Check attachment is in "ready" status (not uploading, not deleted)
3. Load file metadata from S3
4. Build LLM content block with either:
   - For images: URL passed to vision model
   - For code/text: Downloaded to sandbox at `/home/user/.attachments/{threadId}/filename`
5. AI sees both the user message + the file content/URLs
6. Response includes AI reasoning about the files

---

## Architecture: State Model

Each attachment in the composer UI has this lifecycle:

```ts
interface PendingAttachment {
  localId: string;              // React key only (e.g., uuid)
  filename: string;             // "app.ts"
  mimeType: string;             // "application/typescript"
  purpose: "image" | "file";    // Determined by MIME on picker
  sizeBytes: number;
  status: "uploading" | "uploaded" | "error";
  record?: UserAttachmentItem;  // Server response (if uploaded)
  error?: string;               // Error message (if failed)
  previewUrl?: string;          // Object URL for image preview
}
```

### State Transitions

```
           user selects
              from picker
                 ↓
          ┌─────────────┐
          │ Uploading   │
          └─────┬───────┘
                │
        ┌───────┴────────┐
        ↓                ↓
    ┌────────┐      ┌───────┐
    │Uploaded│      │ Error │
    └───┬────┘      └───┬───┘
        │               │
    (send)          (dismiss)
        │               │
        ↓               ↓
    ┌────────┐      ┌─────┐
    │  Sent  │      │ Idle│
    └────────┘      └─────┘
```

**Key rules:**
- Only **server-issued `attachmentId`** is sent to backend
- Local `previewUrl` (Object URL) must be **revoked** on remove/unmount
- Error in one file **does not delete** successful uploads from the same batch
- Attachment state **resets after send**, not before request construction
- Send is **blocked** if any attachment is still uploading

---

## Frontend Components: What to Build

### 1. **CommandPalette.tsx** — Enable the Files menu

Currently: Files button is disabled ("Soon")

After:
```tsx
<CommandPaletteItem
  icon={<FileIcon />}
  label="Files"
  onClick={() => fileInputRef.current?.click()}  // ← Enable
/>
```

### 2. **ChatComposer.tsx** — The main orchestrator

Responsibilities:
- Render `<input type="file" />` (hidden, reference via `ref`)
- On file selection: validate + upload each file
- Store attachment state: `PendingAttachment[]`
- Render attachment chips (uploading, uploaded, error, warning states)
- Track upload count → disable Files button if 5 reached
- Block send button if upload in progress
- On send: snapshot attachment IDs → pass to stream hook
- On unmount: revoke all Object URLs

**Pseudo-code flow:**
```tsx
const ChatComposer = () => {
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: FileList) => {
    // 1. Validate all files locally
    const validated = validateFiles(files, LIMITS, ACCEPTED_TYPES);
    
    // 2. Create pending attachments with localId
    const pending = validated.map(file => ({
      localId: uuid(),
      filename: file.name,
      ...
    }));
    setAttachments(prev => [...prev, ...pending]);

    // 3. Upload each file
    for (const file of validated) {
      const uploaded = await uploadAttachment(file, {
        modelName: chatModel.name,
        isSupportImages: chatModel.supportsImages,
      });
      
      // Update attachment record on success
      setAttachments(prev => 
        prev.map(a => a.localId === localId ? { ...a, record, status: 'uploaded' } : a)
      );
    }
  };

  const handleSend = async (text: string) => {
    const attachmentIds = attachments
      .filter(a => a.status === 'uploaded')
      .map(a => a.record.attachmentId);
    
    await submitMessage(text, { attachmentIds });
    setAttachments([]);  // Clear after send
  };

  return (
    <ComposerContainer>
      {attachments.length > 0 && (
        <AttachmentChips
          attachments={attachments}
          onRemove={(localId) => setAttachments(prev => prev.filter(a => a.localId !== localId))}
        />
      )}
      <textarea value={text} onChange={...} />
      <Button 
        onClick={() => handleSend(text)}
        disabled={attachments.some(a => a.status === 'uploading')}
      >
        Send
      </Button>
    </ComposerContainer>
  );
};
```

### 3. **AttachmentChip.tsx** — Visual states

```tsx
const AttachmentChip = ({ attachment }) => {
  if (attachment.status === 'uploading') {
    return (
      <Chip>
        <Spinner />
        <span>{attachment.filename}</span>
      </Chip>
    );
  }
  
  if (attachment.status === 'uploaded') {
    return (
      <Chip>
        {attachment.record.kind === 'image' && (
          <img src={attachment.previewUrl} alt="preview" />
        )}
        {attachment.record.kind === 'file' && (
          <FileIcon />
        )}
        <span>{attachment.filename}</span>
        {attachment.record.visionWarning && (
          <Tooltip text={attachment.record.visionWarning.message}>
            <WarningIcon />
          </Tooltip>
        )}
        <Button onClick={onRemove} icon="x" />
      </Chip>
    );
  }
  
  if (attachment.status === 'error') {
    return (
      <Chip variant="destructive">
        <ErrorIcon />
        <span>{attachment.error}</span>
        <Button onClick={onDismiss} icon="x" />
      </Chip>
    );
  }
};
```

### 4. **use-new-thread-stream.ts** — Send in new thread

```ts
const startNewThreadWithAttachments = async (
  text: string,
  attachmentIds: string[],
) => {
  return await createRun({
    input: {
      messages: [
        {
          role: "human",
          content: text,
          attachmentIds,  // ← Pass here
        }
      ]
    }
  });
};
```

### 5. **use-existing-thread-stream.ts** — Send in existing thread

```ts
const addFollowUpWithAttachments = async (
  threadId: string,
  text: string,
  attachmentIds: string[],
) => {
  return await appendToThread(threadId, {
    role: "human",
    content: text,
    attachmentIds,  // ← Same contract
  });
};
```

---

## API Layer: What to Create

### `api/attachments.ts` — Upload and CRUD

```ts
export const uploadAttachment = async (
  file: File,
  options: {
    modelName?: string;
    isSupportImages?: boolean;
    purpose?: "image" | "file";
  },
): Promise<UserAttachmentItem> => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  
  if (options.modelName) {
    formData.append("modelName", options.modelName);
  }
  if (options.isSupportImages !== undefined) {
    formData.append("isSupportImages", String(options.isSupportImages));
  }

  try {
    const response = await apiClient.post<UploadResponse>(
      apiPaths.attachments,
      formData,
      // IMPORTANT: Let axios auto-detect Content-Type with boundary
      { headers: { "Content-Type": undefined } },
    );

    return normalizeUploadResponse(response.data);
  } catch (error) {
    throw mapApiError(error);  // Convert 400/413/500 to user-friendly text
  }
};

export const getAttachment = async (id: string): Promise<UserAttachmentItem> => {
  const response = await apiClient.get(`${apiPaths.attachments}/${id}`);
  return response.data;
};

export const deleteAttachment = async (id: string): Promise<void> => {
  await apiClient.delete(`${apiPaths.attachments}/${id}`);
};

export const restoreAttachment = async (id: string): Promise<UserAttachmentItem> => {
  const response = await apiClient.patch(`${apiPaths.attachments}/${id}`, {
    status: "active",
  });
  return response.data;
};
```

### `types/attachments.ts` — Type definitions

```ts
export interface UserAttachmentItem {
  attachmentId: string;
  sequence: number;
  kind: "image" | "file";
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  width: number | null;     // Images only
  height: number | null;    // Images only
  url: string;              // Presigned S3 URL
  previewUrl: string | null; // Thumbnail for images
  expiresAt: string;        // ISO 8601
  uploadedAt: string;       // ISO 8601
  warning?: AttachmentWarning | null;
  visionWarning?: AttachmentWarning | null;
}

export interface AttachmentWarning {
  code: string;
  message: string;
  modelName?: string;
}

export interface UploadResponse {
  attachments: Array<{
    filename: string;
    ok: boolean;
    attachment?: UserAttachmentItem;
    error?: { code: string; message: string };
    warning?: AttachmentWarning;
    visionWarning?: AttachmentWarning;
  }>;
}

export interface PendingAttachment {
  localId: string;
  filename: string;
  mimeType: string;
  purpose: "image" | "file";
  sizeBytes: number;
  status: "uploading" | "uploaded" | "error";
  record?: UserAttachmentItem;
  error?: string;
  previewUrl?: string;  // Object URL for local preview
}
```

---

## Testing Strategy

### Unit Tests

```ts
// validation.test.ts
describe("File validation", () => {
  it("rejects empty files", () => {
    expect(validateFiles([emptyFile])).toBe([]);
  });
  
  it("rejects images over 50 MB", () => {
    const largeImage = new File([], "test.png", { type: "image/png" });
    Object.defineProperty(largeImage, "size", { value: 60_000_000 });
    expect(validateFiles([largeImage])).toBe([]);
  });
  
  it("accepts up to 10 files in one batch", () => {
    const files = Array(10).fill(createValidFile());
    expect(validateFiles(files).length).toBe(10);
  });
  
  it("rejects unsupported MIME types", () => {
    const executable = new File([], "script.exe", { type: "application/x-msdownload" });
    expect(validateFiles([executable])).toBe([]);
  });
});

// normalization.test.ts
describe("Upload response normalization", () => {
  it("handles partial failure", () => {
    const response: UploadResponse = {
      attachments: [
        { filename: "ok.ts", ok: true, attachment: { attachmentId: "att_001", ... } },
        { filename: "fail.exe", ok: false, error: { code: "UNSUPPORTED_TYPE", ... } },
      ]
    };
    const normalized = normalizeUploadResponse(response);
    expect(normalized).toHaveLength(2);
    expect(normalized[0].status).toBe("uploaded");
    expect(normalized[1].status).toBe("error");
  });
});

// api-error.test.ts
describe("Error mapping", () => {
  it("maps 413 to 'file too large'", () => {
    const error = new AxiosError("", "413");
    expect(mapApiError(error)).toContain("exceeds");
  });
});
```

### Component Tests

```ts
// ChatComposer.test.tsx
describe("ChatComposer", () => {
  it("enables Files button on initial render", () => {
    render(<ChatComposer />);
    expect(screen.getByLabelText("Files")).not.toBeDisabled();
  });
  
  it("opens file picker on Files click", () => {
    render(<ChatComposer />);
    fireEvent.click(screen.getByLabelText("Files"));
    expect(fileInputRef.current?.click).toHaveBeenCalled();
  });
  
  it("renders uploading chip with spinner", async () => {
    render(<ChatComposer />);
    fireEvent.change(fileInputRef.current, { target: { files: [validFile] } });
    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });
  });
  
  it("disables send while uploads are in progress", async () => {
    render(<ChatComposer />);
    fireEvent.change(fileInputRef.current, { target: { files: [validFile] } });
    expect(screen.getByText("Send")).toBeDisabled();
  });
  
  it("blocks Files button when 5 attachments are uploaded", async () => {
    const attachments = Array(5).fill({ status: "uploaded", ... });
    render(<ChatComposer initialAttachments={attachments} />);
    expect(screen.getByLabelText("Files")).toBeDisabled();
    expect(screen.getByText("Attachment limit reached")).toBeInTheDocument();
  });
});

// AttachmentChip.test.tsx
describe("AttachmentChip", () => {
  it("shows progress spinner while uploading", () => {
    const chip = { status: "uploading", filename: "app.ts" };
    render(<AttachmentChip attachment={chip} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
  
  it("shows thumbnail for uploaded images", () => {
    const chip = {
      status: "uploaded",
      record: { kind: "image", previewUrl: "blob:..." }
    };
    render(<AttachmentChip attachment={chip} />);
    expect(screen.getByAltText("preview")).toHaveAttribute("src", "blob:...");
  });
  
  it("shows vision warning tooltip without blocking upload", () => {
    const chip = {
      status: "uploaded",
      record: {
        visionWarning: { code: "UNSUPPORTED", message: "Model cannot see code" }
      }
    };
    render(<AttachmentChip attachment={chip} />);
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
  });
});
```

### Integration Tests

```ts
// end-to-end.test.ts
describe("New thread with attachments", () => {
  it("sends attachmentIds in run payload", async () => {
    const { getByLabelText, getByText } = render(<ChatPanel />);
    
    // Select files
    fireEvent.change(fileInputRef.current, { target: { files: [tsFile, pngFile] } });
    await waitFor(() => expect(getByText("app.ts")).toBeInTheDocument());
    
    // Type message
    fireEvent.change(getByTestId("composer-input"), { target: { value: "Review these" } });
    
    // Send
    fireEvent.click(getByText("Send"));
    
    // Verify request includes attachmentIds
    expect(createRunMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          messages: [
            {
              role: "human",
              content: "Review these",
              attachmentIds: ["att_001", "att_002"],
            }
          ]
        }
      })
    );
  });
  
  it("preserves text-only behavior when no attachments", async () => {
    const { getByTestId, getByText } = render(<ChatPanel />);
    fireEvent.change(getByTestId("composer-input"), { target: { value: "Hi" } });
    fireEvent.click(getByText("Send"));
    
    expect(createRunMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          messages: [
            {
              role: "human",
              content: "Hi",
              // attachmentIds not present
            }
          ]
        }
      })
    );
  });
});

describe("Existing thread with attachments", () => {
  it("sends attachmentIds in follow-up", async () => {
    render(<ChatPanel threadId="t_123" />);
    
    fireEvent.change(fileInputRef.current, { target: { files: [pyFile] } });
    await waitFor(() => expect(getByText("script.py")).toBeInTheDocument());
    
    fireEvent.change(getByTestId("composer-input"), { target: { value: "Debug this" } });
    fireEvent.click(getByText("Send"));
    
    expect(appendToThreadMock).toHaveBeenCalledWith(
      "t_123",
      expect.objectContaining({
        attachmentIds: ["att_003"],
      })
    );
  });
});
```

---

## Implementation Slices (Sprint Plan)

### Slice 1: Contract Types and API Client (1 day)
- [ ] Create `types/attachments.ts` with all interfaces
- [ ] Create `api/attachments.ts` with upload/CRUD helpers
- [ ] Implement multipart encoding + error mapping
- [ ] Add API path to `api/paths.ts`
- [ ] Write unit tests for normalization and error handling
- **Gate:** All tests pass, type checking clean

### Slice 2: SDK Message Payload (0.5 days)
- [ ] Add `attachmentIds?: string[]` to `AgentInputMessage`
- [ ] Update `useAgentStream.submit` to preserve it
- [ ] Update `buildMessagePayload` serialization
- [ ] Write SDK tests for attachment serialization
- **Gate:** Backward compatibility confirmed (text-only unchanged)

### Slice 3: Single-File Composer Upload (1.5 days)
- [ ] Enable Files button in CommandPalette
- [ ] Create file input ref + picker invocation
- [ ] Implement client-side validation
- [ ] Single-file upload with success/error states
- [ ] Write component tests
- **Gate:** One file uploads, renders chip, displays error if failed

### Slice 4: Multi-File Lifecycle and UX (2 days)
- [ ] Add five-item cap with disabled state + tooltip
- [ ] Batch uploads (slice into 10-file groups)
- [ ] Render previews for images (Object URLs)
- [ ] Show warning/error chips with remove/dismiss
- [ ] Implement URL cleanup on remove/unmount
- [ ] Block send while uploading
- [ ] Write state transition tests
- **Gate:** All states transition correctly, send blocked until ready

### Slice 5: New-Thread End-to-End (1 day)
- [ ] Pass attachment IDs from composer to `use-new-thread-stream`
- [ ] Update message payload builder
- [ ] Verify request body includes `attachmentIds`
- [ ] Test optimistic rendering with attachments
- [ ] Write integration tests
- **Gate:** Full request body correct, optimistic UI works

### Slice 6: Existing-Thread End-to-End (1 day)
- [ ] Apply same contract to `use-existing-thread-stream`
- [ ] Verify append behavior
- [ ] Test retry without duplication
- [ ] Write integration tests
- **Gate:** Follow-up messages include attachments correctly

### Slice 7: Backend Contract Verification (1.5 days)
- [ ] Verify public ID format (`att_NNN` vs UUID)
- [ ] Test atomic ownership validation (404 for cross-tenant)
- [ ] Confirm attachment "ready" status filtering
- [ ] Test five-item rejection
- [ ] Write contract tests in agent-service
- **Gate:** All backend assumptions validated

**Total: ~6 days of focused implementation**

---

## Open Questions (Need Backend Owner to Answer)

| # | Question | Impact | Block? |
|---|----------|--------|--------|
| 1 | Are public IDs `att_001`, UUIDs, or both? | Response normalization | **YES** |
| 2 | Does model metadata expose `isSupportImages`? | Upload options, warnings | NO (send as optional) |
| 3 | Delete failed uploads or let cleanup handle? | UX after partial failure | NO (let cleanup) |
| 4 | Drag-and-drop in first release? | Scope boundary | NO (picker only) |
| 5 | Persist attachment metadata in thread history? | Reload behavior | NO (server enriches) |

---

## Boundaries and Safety

### ✅ Always Do

- Validate files locally **and** trust server as authority
- Send only **server-issued attachment IDs** (never raw files)
- Use centralized `apiClient` and `apiPaths`
- Preserve text-only behavior entirely
- Add focused tests per slice
- **Revoke every Object URL** created (no leaks)

### ❓ Ask First

- Change public ID format
- Change run payload contract
- Add new dependency
- Modify `@agent-chat/react` API
- Change backend storage/worker/auth
- Add persistent attachment library UI

### ❌ Never Do

- Send raw file bytes or presigned URLs in run payload
- Trust client-generated IDs as identity
- Set `x-user-id` or `x-org-id` from browser
- Hardcode multipart boundaries
- Put app API calls inside `packages/agent-chat`
- Hide or silently drop upload errors
- Forget to revoke Object URLs before cleanup

---

## Success Criteria Checklist

- [ ] Files enabled in quick-actions menu
- [ ] Every accepted file reaches `uploaded` or visible `error`
- [ ] No message sends > 5 attachment IDs
- [ ] Message includes `input.messages[0].attachmentIds` in run request
- [ ] New and existing threads use same contract
- [ ] Text-only messages unchanged
- [ ] Image warnings don't block upload
- [ ] Uploading attachments block send
- [ ] Local preview URLs revoked on remove/unmount
- [ ] `npm run build && npm test && npm run lint` all pass
- [ ] Backend contract tests confirm ID format + tenant safety

---

## Key Insights

### 1. **Token Economy Alignment**

This spec is part of the larger **Sandbox Attachment Sync** initiative (see `attachments-feature-spec.md`):
- Files uploaded via this UI
- Worker downloads them to E2B sandbox
- Large files represented as pointer blocks (~350 tokens instead of 12K)
- **Result:** 90% cost reduction for large attachments

### 2. **Multi-Tenant Safety**

- Server performs atomic ownership check for every `attachmentId`
- No cross-tenant data leaks possible (4xx if not owned)
- Browser never sets auth headers (`x-user-id`, `x-org-id`) — cookies only

### 3. **Partial Failure Resilience**

- One file fails → others uploaded successfully
- Error shown inline, successful files ready to send
- User can remove failed files and retry later

### 4. **Backward Compatibility**

- Text-only messages **completely unchanged** in request/response
- Existing code paths untouched
- New `attachmentIds` field is optional everywhere

### 5. **Progressive Disclosure**

- No drag-and-drop complexity in first release
- No attachment library/history UI
- Focus on picker + upload + send flow
- Library can be added later without breaking changes

---

## Summary

This is a **well-scoped, security-conscious frontend spec** for chat attachments. It:

✅ **Clearly defines** what users see and how it works  
✅ **Specifies exact API contracts** (request/response shapes)  
✅ **Breaks implementation into 7 testable slices**  
✅ **Provides detailed component & test examples**  
✅ **Enforces security boundaries** (never trust client IDs, always validate server)  
✅ **Documents dependencies** on backend infrastructure  
✅ **Identifies unresolved questions** that block certain decisions  

**Estimated effort:** 5–7 sprints of implementation + testing + backend verification.
