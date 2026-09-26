# Attachments Feature — Quick Reference Guide

## The Two Systems (One Feature)

### System 1: Backend Infrastructure (85% Done)
**Location:** `services/agent-server/` + `services/worker-ts-new/`

**What Works:**
- POST /v1/attachments (upload with 11-step validation)
- GET/DELETE/PATCH endpoints
- PostgreSQL schema (multi-tenant, deduped)
- S3 storage + presigned URLs
- Image preprocessing
- Worker attachment loader
- Content block builder

**What's Missing:**
- ❌ **Cleanup not scheduled** (5-min fix needed)

**Key Metric:** 90% cost reduction, 70% faster first-token latency

---

### System 2: Frontend UI (0% Done)
**Location:** `apps/syncfusion-code/src/`

**What to Build:**
- File picker + upload UI
- Attachment chips (uploading/uploaded/error states)
- Send integration with attachmentIds
- Local image previews (with cleanup)
- Validation + error handling

**Implementation Plan:** 7 slices, 5–7 days total

---

## The Critical 5-Minute Fix

**File:** `services/agent-server/src/main.ts`

**Problem:** Cleanup service exists but never runs

**Solution:**
```ts
import { attachmentsCleanupPlugin } from "./plugins/attachments-cleanup.plugin.js";

export async function createApp() {
  const app = fastify(config);
  
  // ... middleware ...
  
  await app.register(attachmentsCleanupPlugin);  // ← ADD THIS LINE
  
  // ... routes ...
  
  return app;
}
```

**Impact:** Without this, deleted files stay in S3 forever → quotas break

---

## Request/Response Shapes

### Upload Request
```ts
POST /v1/attachments
Content-Type: multipart/form-data

{
  file: File              // One or more files
  modelName?: string      // e.g., "claude-3-5-sonnet"
  isSupportImages?: bool
  purpose?: "image" | "file"
}
```

### Upload Response
```ts
{
  attachments: [
    {
      filename: "app.ts",
      ok: true,
      attachment: {
        attachmentId: "att_001",        // ← Use this in run payload
        kind: "file",
        mimeType: "application/typescript",
        sizeBytes: 2048,
        url: "https://s3.../att_001.ts?sig=...",
        previewUrl: null,
        expiresAt: "2025-02-01T...",
        warning: null,
        visionWarning: null,
      }
    },
    {
      filename: "screenshot.png",
      ok: true,
      attachment: {
        attachmentId: "att_002",
        kind: "image",
        width: 1920,
        height: 1080,
        previewUrl: "https://s3.../att_002-thumb.webp?sig=..."
      }
    },
    {
      filename: "large.bin",
      ok: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "File exceeds 5 MB limit"
      }
    }
  ]
}
```

### Run Request with Attachments
```ts
POST /v1/runs
{
  input: {
    messages: [
      {
        role: "human",
        content: "Review these files",
        attachmentIds: ["att_001", "att_002"]  // ← Include here
      }
    ]
  }
}
```

---

## Limits

| Limit | Value |
|-------|-------|
| Max attachments per message | 5 |
| Max files in one upload batch | 10 |
| Max image size | 50 MB |
| Max code/text file size | 5 MB |

---

## Supported File Types

**Images (7):** PNG, JPEG, WebP, GIF, SVG, HEIC, HEIF

**Code (13):** TS, TSX, JS, JSX, Python, Ruby, Go, Rust, Java, Kotlin, Swift, C, C++

**Structured (4):** JSON, XML, HTML, Markdown

**Text (4):** TXT, CSV, YAML, TOML

---

## Frontend Component Checklist

### Slice 1: Types + API (1 day)
- [ ] `types/attachments.ts` — All interfaces
- [ ] `api/attachments.ts` — Upload/CRUD helpers
- [ ] `api/paths.ts` — Endpoint URLs
- [ ] Unit tests for normalization + errors

### Slice 2: SDK Payload (0.5 days)
- [ ] Add `attachmentIds` to `AgentInputMessage`
- [ ] Update `useAgentStream.submit`
- [ ] SDK tests (serialization, backward compat)

### Slice 3: Single-File Upload (1.5 days)
- [ ] Enable Files button
- [ ] File input + picker
- [ ] Client validation
- [ ] Upload with success/error states
- [ ] Component tests

### Slice 4: Multi-File UX (2 days)
- [ ] 5-item cap + disabled state
- [ ] Batch uploads (10-file chunks)
- [ ] Image previews (Object URLs)
- [ ] Warning/error chips
- [ ] URL cleanup on remove/unmount
- [ ] Send blocking

### Slice 5: New-Thread E2E (1 day)
- [ ] Composer → stream hook
- [ ] Verify request includes attachmentIds
- [ ] Optimistic rendering
- [ ] Integration tests

### Slice 6: Existing-Thread E2E (1 day)
- [ ] Follow-up message flow
- [ ] Same contract as new-thread
- [ ] Retry without duplication
- [ ] Integration tests

### Slice 7: Backend Verification (1.5 days)
- [ ] Confirm public ID format
- [ ] Test ownership validation
- [ ] Test attachment status filtering
- [ ] Test 5-item limit
- [ ] Contract tests

---

## State Machine: Attachment Lifecycle

```
┌──────────────────┐
│  User selects    │
│  from picker     │
└────────┬─────────┘
         │
         ↓
    ┌─────────────┐
    │ UPLOADING   │
    └──┬─────┬────┘
       │     │
       │  (cancel by user)
       │     │
       │     ↓
       │  ┌─────┐
       │  │ IDLE│
       │  └─────┘
       │
       ├──────────────┐
       │              │
  (success)       (failure)
       │              │
       ↓              ↓
  ┌────────┐    ┌──────────┐
  │UPLOADED│    │  ERROR   │
  └───┬────┘    └────┬─────┘
      │              │
   (send)        (dismiss)
      │              │
      ↓              ↓
  ┌────────┐    ┌──────────┐
  │  SENT  │    │   IDLE   │
  └────────┘    └──────────┘
```

---

## Security Checklist (Never Forget)

- ❌ **Never:** Send raw file bytes in payload
- ❌ **Never:** Trust client-generated IDs
- ❌ **Never:** Set `x-user-id` or `x-org-id` from browser
- ❌ **Never:** Leave Object URLs unrevoked
- ✅ **Always:** Validate locally + trust server
- ✅ **Always:** Send only server-issued attachment IDs
- ✅ **Always:** Check ownership on every request
- ✅ **Always:** Show errors inline (don't silently drop)

---

## Open Backend Questions

Before implementing frontend Slice 1, get answers:

1. **Public ID format?** `att_001` or UUID?
2. **Model metadata exposes `isSupportImages`?**
3. **Delete failed uploads or let cleanup?**
4. **Drag-and-drop required v1?**
5. **Persist metadata in history or server-enrich?**

---

## Testing Pyramid

### Unit Tests (Types, Validation, Normalization)
- File validation rules
- Upload response parsing
- Error mapping
- SDK serialization

### Component Tests (UI States)
- Files button enable/disable
- Picker invocation
- Upload states (uploading/uploaded/error)
- 5-item cap + tooltip
- Send blocking
- URL cleanup

### Integration Tests (Full Flows)
- New-thread sends attachmentIds
- Existing-thread sends attachmentIds
- Text-only unchanged
- Partial failure resilience

### Contract Tests (Backend)
- Public ID lookup
- Ownership validation (404 cross-tenant)
- Status filtering (deleted/not-ready)
- Max limit enforcement

---

## Cost Impact

### Before (without sandbox sync)
```
5-turn conversation with 1 large file:
  60,000 tokens = $0.20–$0.50 per thread
```

### After (with sandbox + pointer blocks)
```
5-turn conversation with same file:
  1,750 tokens = $0.01–$0.03 per thread
  ─────────────────────────
  Savings: 97% tokens, 90% cost
```

---

## Timeline

| Milestone | Days | Owner |
|-----------|------|-------|
| Critical fix (cleanup scheduling) | 0.5 | Backend |
| Frontend Slices 1–2 | 1.5 | Frontend |
| Frontend Slices 3–4 | 3.5 | Frontend |
| Frontend Slices 5–7 | 3.5 | Frontend |
| Integration + E2E | 2–3 | Full Team |
| Polish + Docs | 1 | Full Team |
| **Total** | **~12–14 days** | |

---

## Key Files to Know

### Backend
- `services/agent-server/src/routes/attachments.route.ts` — REST endpoints
- `services/agent-server/src/services/attachment.service.ts` — Business logic
- `services/worker-ts-new/src/services/sandbox-attachment-sync.service.ts` — Download to sandbox
- `services/agent-server/src/plugins/attachments-cleanup.plugin.ts` — Cleanup job (needs scheduling!)

### Frontend
- `apps/syncfusion-code/src/api/attachments.ts` — API client
- `apps/syncfusion-code/src/types/attachments.ts` — Types
- `apps/syncfusion-code/src/components/chat/ChatComposer.tsx` — Main upload UI
- `apps/syncfusion-code/src/components/chat/AttachmentChip.tsx` — Chip states
- `apps/syncfusion-code/src/chat/use-new-thread-stream.ts` — New thread integration
- `apps/syncfusion-code/src/chat/use-existing-thread-stream.ts` — Follow-up integration

---

## Decision Tree: Which File to Read?

```
Q: What layer am I working on?
├─ Backend infrastructure?
│  → Read ANALYSIS_ATTACHMENTS_SPEC.md (878 lines)
│
├─ Frontend UI?
│  → Read ANALYSIS_ATTACHMENTS_UI_SPEC.md (866 lines)
│
├─ Big picture / how they fit together?
│  → Read COMPLETE_ATTACHMENTS_ANALYSIS_SUMMARY.md
│
└─ Quick reference / this is it
   → You're reading it now! ✓
```

---

## One-Paragraph Summary

The **Attachments feature** is a multi-layer file upload system where users attach files via a chat composer UI, the frontend uploads them to the backend with multipart requests, the server validates and stores them in S3, and when a message is sent with attachment IDs, the worker downloads files to a sandbox, builds content blocks for the LLM with either URLs (images) or sandbox paths (code/text), and the AI responds with insights about the files. The backend is 85% done (missing only scheduled cleanup), and the frontend is a straightforward 7-slice implementation worth 5–7 days. The feature saves 90% on LLM token costs by using pointer blocks instead of inlining large files in every turn.

---

**Last updated:** Jan 15, 2025  
**Branch:** `feat/cs-4e208100`  
**Status:** Ready for implementation
