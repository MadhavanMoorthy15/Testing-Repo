# Attachments Implementation Analysis

**Document Date:** 2026-09-21  
**Status Document Version:** 2.2  
**Analysis Type:** File-by-file breakdown of what's done, what's pending, and implementation roadmap

---

## Executive Summary

The **ATTACHMENTS_IMPLEMENTATION_STATUS.md** document describes a comprehensive attachments feature for an agent platform. The system is **85–90% complete** with core infrastructure fully built, but **3 critical gaps** remain:

1. ❌ **Scheduled cleanup job** — Phase 5 service exists but isn't wired to a periodic trigger
2. ❌ **End-to-end integration tests** — Frontend ↔ backend round-trip tests incomplete
3. ⚠️ **Observability** — Metrics/monitoring partially implemented

---

## What's Been Implemented (13 Components)

### 1. **Data Model** ✅ COMPLETE
**File:** `services/shared/src/db/schema/user-attachments.ts`

**What it does:**
- PostgreSQL table schema for storing attachment metadata
- Supports org/user scoping (multi-tenant safety)
- Stable public IDs (`att_NNN` format) for API references
- File metadata: name, MIME type, size, SHA-256 hash
- Image metadata: width, height (for vision LLMs)
- S3 storage keys: original + thumbnail
- Presigned URL caching (avoid repeated generation)
- Usage tracking: `lastUsedAt`, `useCount` for LRU eviction

**Key Index:**
- `uniqueHashPerUser` — **Deduplication:** Same file bytes uploaded twice by same user = one DB row + return existing (saves storage)

**Lifecycle:**
- Soft-delete model: `status='deleted'` + 30-day restore window before hard-delete

---

### 2. **Upload REST Endpoint** ✅ COMPLETE
**File:** `services/agent-server/src/routes/attachments.route.ts`

**POST /v1/attachments:**
- Multipart form-data upload (up to 10 files per request)
- Magic-bytes MIME validation (detect spoofed file types)
- Rate limit: **100 uploads/hour per user** (env-driven)
- Per-file error collection (one bad file doesn't block others)
- Response: 201 Created with per-file results

**Other endpoints:**
- `GET /v1/attachments` — Paginated list with filters
- `GET /v1/attachments/:id` — Single attachment + presigned URL refresh
- `DELETE /v1/attachments/:id` — Soft-delete
- `PATCH /v1/attachments/:id` — Restore

**Error codes:**
```
400: NO_FILE, INVALID_MIME, SPOOFED_MIME, SIZE_EXCEEDED
409: LIMIT_EXCEEDED (100 per user)
413: QUOTA_EXCEEDED (org > 10GB)
429: RATE_LIMIT
507: STORAGE_ERROR
```

---

### 3. **Attachment Service (11-Step Validation Pipeline)** ✅ COMPLETE
**File:** `services/agent-server/src/services/attachment.service.ts`

**Flow:**
```
1. ✅ Auth check (user owns this upload)
2. ✅ Magic-bytes detection (file-type npm)
3. ✅ MIME whitelist (35 types):
   - Images: jpeg, png, gif, webp, bmp, tiff, svg+xml (7)
   - Code/text: plain, markdown, html, css, xml, c, cpp, java, python, javascript, 
               typescript, jsx, go, rust, ruby, php, swift, kotlin, scala, shell, sql, yaml, dockerfile (22)
   - Structured: json, xml, yaml (3)
4. ✅ Size check (50MB images, 5MB text, env-driven)
5. ✅ Org quota (SUM(size_bytes) < 10GB default)
6. ✅ User count (COUNT(*) < 100 default)
7. ✅ SHA-256 dedup lookup (UNIQUE index)
   → Hit = return existing (200 OK)
   → Miss = continue
8. ✅ Image preprocessing (if image):
   - Sharp library (lazy-loaded)
   - Resize to 2048px max (preserve aspect ratio)
   - EXIF strip (privacy)
   - JPEG q85 (lossy compression)
   - Thumbnail generation (512px)
   - SVG rasterization (sharp→PNG for LLM)
9. ✅ S3 PUT (3× exponential backoff on transient failures)
10. ✅ Presigned URL generation (30-day default, clamped to 7d without CloudFront)
11. ✅ INSERT user_attachments (atomic sequence increment)
```

**Rejected file types:** PDF (deferred), executables, archives, audio, video, fonts, octet-stream

---

### 4. **Repository Layer** ✅ COMPLETE
**File:** `services/agent-server/src/repositories/user-attachment.repository.ts`

**CRUD operations:**
```
✅ create()              — Insert with atomic sequence
✅ findById()            — By UUID primary key
✅ findByPublicId()      — By att_NNN ID
✅ findMany()            — Paginated list
✅ findManyByPublicIds() — Bulk load (for run resolution)
✅ update()              — Soft-delete + restore
✅ updatePresignedUrl()  — Refresh cached URL
✅ delete()              — Hard-delete (Phase 5 cleanup)
✅ deleteByOrgId()       — Cascade on org deletion
✅ sumSizeBytes()        — Org quota calculation
✅ countReady()          — User attachment count
✅ findDuplicate()       — SHA-256 dedup lookup
✅ bumpUsage()           — LRU bookkeeping
```

**All queries are org/user scoped** — no cross-tenant leaks.

---

### 5. **Attachment Cleanup Service** ✅ COMPLETE (BUT NOT SCHEDULED ❌)
**File:** `services/agent-server/src/services/attachment-cleanup.service.ts`

**Three-phase cleanup strategy:**

**Phase A — S3 Hard-Delete:**
- After 1-hour soft-delete window, physically delete from S3
- Prevents storage bloat

**Phase B — Idle Eviction:**
- Soft-delete attachments unused >30 days
- Space reclamation for stale files

**Phase C — Quota Enforcement:**
- When org exceeds 10GB, LRU evict least-recently-used attachments
- Automatically keeps org within quota

**Safety:**
- Postgres advisory lock (dual-key namespace)
- Prevents concurrent runs
- Each phase is idempotent (no-op if nothing to do)
- Stats emitted at info log level

**❌ MISSING:** Plugin registration to schedule this every 1 hour.

---

### 6. **Runs Endpoint Integration** ✅ COMPLETE
**File:** `services/agent-server/src/routes/runs.route.ts` (lines 540–650)

**POST /v1/runs extended schema:**
```json
{
  "attachmentIds": ["att_001", "att_002"],
  "messages": [
    {
      "role": "user",
      "content": "Review this code",
      "attachmentIds": ["att_001"]
    }
  ]
}
```

**Validation:**
- Regex: `/^att_\d{3,}$/`
- Max 20 attachments per run
- Check: `SELECT WHERE orgId=X AND userId=Y AND attachmentId IN (...) AND status='ready'`
- 404 if any attachment not owned / not found

**Flow:**
- Valid attachmentIds → BullMQ job payload
- Worker receives validated refs only (never untrusted sources)

---

### 7. **Threads Endpoint Integration** ✅ COMPLETE
**File:** `services/agent-server/src/routes/threads.route.ts`

**PATCH /threads/:id extended schema:**
```json
{
  "attachmentIds": ["att_001"],
  "role": "user",
  "content": "Follow-up question"
}
```

**Flow:**
1. Client sends attachmentIds
2. Server loads from `user_attachments`
3. Server inlines into human message's content array
4. Message stored in threads.messages JSONB with image/file blocks
5. Auto-creates new run

---

### 8. **Worker Attachment Loading** ✅ COMPLETE
**File:** `services/worker-ts-new/src/services/attachment.service.ts`

**WorkerAttachmentService:**
- Bulk load rows by public ID
- Ordered to match input list
- **URL refresh policy:** Refresh if `expiresAt < 1 hour from now`
- LRU bookkeeping bump (single atomic UPDATE)
- Non-retryable error on missing attachment (contract breach)

**Presigner Reuse:**
- Reuses agent-server's `IArtifactStorage` presigner
- Consistent URL format across system
- S3 + CloudFront support

---

### 9. **Attachment Blocks Builder** ✅ COMPLETE
**File:** `services/worker-ts-new/src/utils/build-attachment-blocks.ts`

**Anthropic-compatible block generation:**

```typescript
// Image blocks
{ type: "image", source: { type: "url", url } }

// Small text files (inline)
{ type: "text", text: "// File: schema.sql\n\n<body>" }

// Large text files (pointer)
{ type: "text", text: "<file:att_NNN> too large (68KB)..." }
```

**Metadata preserved:**
- fileId, mimeType, fileName, sizeBytes, sha256

**Error handling (soft failures):**
- Image fetch failure → text pointer block
- Text fetch failure (404/expired) → text pointer block
- No URL cached → text pointer with error

**HTTPS-only URLs:**
- Non-HTTPS → text pointer (LLM provider requirement)

**Inline text cap:** Default 50KB
- Files >50KB → pointer block (preserves token budget)

---

### 10. **Orchestrator Type Extensions** ✅ COMPLETE
**Files:**
- `services/worker-ts-new/src/jobs/orchestrator-types.ts`
- `services/worker-ts-new/src/jobs/agent-run-orchestrator.ts`
- `services/worker-ts-new/src/jobs/run.processor.ts`

**What happens:**
- RunInput type extended with attachmentIds
- Orchestrator passes attachmentIds to runtime context
- Runtime context builder calls buildAttachmentBlocks()
- BullMQ resume payload handling (attachmentIds maintained)

---

### 11. **Integration Tests** ✅ MOSTLY COMPLETE
**Files:**
- `services/agent-server/tests/integration/artifacts.test.ts`
- `services/agent-server/tests/integration/runs-with-attachments.test.ts`
- `services/agent-server/tests/unit/services/attachment-cleanup.service.test.ts`
- `services/worker-ts-new/tests/unit/services/attachment.service.test.ts`

**What's tested:**
```
✅ Upload + validation flow
✅ Magic-bytes spoofing detection
✅ Deduplication
✅ Presigned URL refresh
✅ Cleanup service phases
✅ Worker-side loading

❌ INCOMPLETE: Frontend ↔ backend round-trip e2e tests
```

---

### 12. **Frontend React Components** ✅ MOSTLY COMPLETE
**Files:**
- `client/react-chat/src/components/AttachmentUploadPicker.tsx`
- `client/react-chat/src/components/AttachmentUploadPicker.test.tsx`
- `client/react-chat/src/pages/DeepAgentChat/ChatView.tsx`
- `client/react-chat/src/pages/DeepAgentChat/components/ChatInput.tsx`
- `client/react-chat/src/pages/DeepAgentChat/components/MessageRow.tsx`
- `client/react-chat/src/lib/api/attachments.ts`
- `client/react-chat/src/lib/api/attachments.test.ts`

**Implemented:**
```
✅ AttachmentUploadPicker
   - File picker button
   - Drag-and-drop
   - Multi-file queue (up to 20)
   - Per-file status (uploading/uploaded/error)
   - Per-file error messages
   - Thumbnail preview (images)
   - Remove button
   - POST /v1/attachments integration

✅ ChatInput integration
   - Picker chip in message bar
   - Attachment ID collection before send
   - Passed to POST /v1/runs

✅ ChatView integration
   - Attachment metadata caching
   - Automatic fetch via GET /v1/attachments/:id

✅ MessageRow display
   - Human message attachment chips
   - Thumbnail preview on hover
   - Link to full attachment

✅ AttachmentsClient API wrapper
   - POST, GET, GET ById, DELETE endpoints

❌ INCOMPLETE:
   - E2E integration test
   - Accessibility audit (ARIA)
   - Error recovery UI (retry button)
   - Large file handling (progress indicator)
```

---

### 13. **Shared Attachments Library** ✅ MOSTLY COMPLETE
**Files:**
- `services/shared/src/attachments/` — Validation + type utilities
- `services/shared/src/artifact-storage/` — S3 + CloudFront presigning

**Implemented:**
```
✅ MIME detection + whitelist validation
✅ Magic-bytes verification (file-type npm)
✅ Type utilities (Attachment, AttachmentWithUsage, etc.)
✅ User attachment wire format mapper
✅ IArtifactStorage interface reuse
```

---

## What's MISSING (3 Critical Gaps)

### Gap 1: **Schedule Background Cleanup** ❌ CRITICAL (5–10 minutes to fix)

**File:** `services/agent-server/src/main.ts`

**What's needed:**
```typescript
import attachmentsCleanupPlugin from "./plugins/attachments-cleanup.plugin.js";

// In setup function, after artifact-storage, before listen:
await app.register(attachmentsCleanupPlugin);
```

**What it does:**
- Starts a `setInterval()` every 1 hour
- Calls `AttachmentCleanupService.sweep()`
- Logs stats (Phase A deleted, Phase B idle, Phase C evicted)

**Impact without this:**
- Soft-deleted rows stay in DB indefinitely
- S3 storage isn't reclaimed
- User quotas won't enforce properly
- Cost bloat over time

---

### Gap 2: **End-to-End Integration Tests** ❌ HIGH PRIORITY (30–45 minutes)

**File to create:** `services/agent-server/tests/integration/attachment-e2e.test.ts`

**Test scenario:**
1. Upload file via POST /v1/attachments
2. Create run with attachmentIds via POST /v1/runs
3. Wait for worker to process
4. Verify message contains image/file content blocks
5. Verify image was resized (if applicable)
6. Verify presigned URL is HTTPS + valid

**Frontend E2E (45–60 minutes):**
- **Tool:** Playwright or Cypress
- Steps:
  1. Open chat UI
  2. Click attachment picker
  3. Select file
  4. Verify upload progress
  5. Send message with attachment
  6. Verify agent sees image in context
  7. Verify response references attachment

---

### Gap 3: **Observability & Metrics** ⚠️ PARTIAL (1–2 hours)

**What's done:**
```
✅ Cleanup service logs stats
✅ Service layer has logger for validation
```

**What's needed:**
```
[ ] Prometheus metrics for attachment uploads (counter)
[ ] Metrics for attachment usage (histogram by size/type)
[ ] Metrics for cleanup phase duration
[ ] Metrics for presigned URL refresh rate
[ ] Alerts for quota approaching (org >8GB)
[ ] Tracing spans for upload → S3 path
```

---

## Configuration Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `MAX_ATTACHMENTS_PER_USER` | 100 | Hard cap per user |
| `MAX_STORAGE_PER_ORG` | 10GB (10737418240) | Org quota bytes |
| `MAX_FILE_SIZE_IMAGES` | 50MB (52428800) | Image size limit |
| `MAX_FILE_SIZE_TEXT` | 5MB (5242880) | Text file size limit |
| `ATTACHMENT_RATE_LIMIT` | 100 | Uploads/hour per user |
| `PRESIGNED_URL_EXPIRY_HOURS` | 720 (30 days) | Cache TTL (clamped to 7d without CloudFront) |
| `ATTACHMENTS_S3_PREFIX` | (empty) | S3 key prefix (e.g., "attachments/") |
| `AWS_S3_BUCKET` | (required) | Bucket name |
| `AWS_REGION` | us-east-1 | S3 region |
| `AWS_CLOUDFRONT_DOMAIN` | (optional) | CloudFront CNAME for signed URLs |

---

## Implementation Checklist

### Phase 1: Data Model
- [x] Create `user_attachments` table schema
- [x] Add dedup unique index
- [x] Add LRU indexes
- [x] Database migration (Drizzle)

### Phase 2: Upload Endpoint & Validation
- [x] POST /v1/attachments handler
- [x] Multipart form-data parsing
- [x] Magic-bytes validation
- [x] MIME whitelist
- [x] Size checks
- [x] Rate limiting
- [x] Per-file error collection
- [x] Dedup lookup
- [x] Image preprocessing
- [x] S3 upload with retry
- [x] Presigned URL generation
- [x] Error handling

### Phase 3: List/Get/Delete Endpoints
- [x] GET /v1/attachments (paginated list)
- [x] GET /v1/attachments/:id (single)
- [x] DELETE /v1/attachments/:id (soft-delete)
- [x] PATCH /v1/attachments/:id (restore)

### Phase 4: Run & Thread Integration
- [x] Extend POST /v1/runs schema
- [x] Extend PATCH /threads/:id schema
- [x] Attachment validation upstream
- [x] BullMQ job payload passthrough
- [x] Worker-side loading
- [x] URL refresh
- [x] LRU bookkeeping
- [x] Content block building
- [x] LLM integration

### Phase 5: Background Cleanup
- [x] AttachmentCleanupService implementation
  - [x] Phase A: S3 hard-delete
  - [x] Phase B: Idle eviction
  - [x] Phase C: Quota enforcement
- [x] Postgres advisory lock
- [ ] **Schedule cleanup interval ❌ MISSING**

### Phase 6: Frontend
- [x] AttachmentUploadPicker component
- [x] ChatInput integration
- [x] ChatView metadata caching
- [x] MessageRow display
- [x] AttachmentsClient API wrapper
- [ ] E2E integration testing
- [ ] Accessibility audit
- [ ] Error recovery UI

### Phase 7: Testing & Observability
- [x] Unit tests
- [x] Integration tests
- [ ] E2E tests
- [ ] Prometheus metrics
- [ ] Observability alerts

---

## Next Steps (Priority Order)

### 1. URGENT (5–10 min): Schedule Cleanup Cron
Register the cleanup plugin in `agent-server/src/main.ts`

**Verification:**
```bash
npm run build
npm run test -- attachment-cleanup
# Verify logs: "attachment-cleanup: running Phase A/B/C every 1h"
```

### 2. HIGH (30–45 min): Write E2E Integration Test
Create `services/agent-server/tests/integration/attachment-e2e.test.ts`

**Test:** Upload → Run → Worker → Message verification

### 3. HIGH (45–60 min): Frontend Playwright Test
Write `client/react-chat/tests/e2e/attachment-flow.spec.ts`

**Test:** Upload → Send → Agent sees attachment → Verify response

### 4. MEDIUM (20–30 min): Update Documentation
- README usage guide
- Configuration reference
- Troubleshooting guide

### 5. MEDIUM (1–2 hours): Prometheus Metrics
- Upload counter
- Usage histogram
- Cleanup phase duration
- Quota alerts

### 6. NICE-TO-HAVE (2–3 hours): Frontend UX Polish
- Retry button on failed upload
- Upload progress indicator
- Cancel in-flight upload
- Large file warning

### 7. NICE-TO-HAVE (1–2 hours): Accessibility Audit
- WCAG AA compliance
- ARIA labels on picker
- Keyboard navigation

---

## Summary Table

| Component | Status | Tests | Frontend | Notes |
|---|---|---|---|---|
| **Data Model** | ✅ | ✅ | — | Ready for production |
| **Upload Endpoint** | ✅ | ✅ | ✅ | Multipart, magic-bytes, rate-limit |
| **List/Get/Delete** | ✅ | ✅ | ✅ | CRUD complete |
| **Run Integration** | ✅ | ✅ | ✅ | Validation + passthrough |
| **Thread Integration** | ✅ | ✅ | ✅ | Follow-up message support |
| **Worker Loading** | ✅ | ✅ | — | URL refresh, LRU bookkeeping |
| **Block Building** | ✅ | ✅ | — | Anthropic-compatible |
| **Image Preprocessing** | ✅ | ✅ | — | Resize, EXIF strip, thumb |
| **Cleanup Service** | ✅ | ✅ | — | **NOT SCHEDULED** ❌ |
| **Frontend Components** | ✅ | ⚠️ | ✅ | Needs error recovery polish |
| **E2E Tests** | ❌ | — | — | Missing round-trip tests |
| **Observability** | ⚠️ | — | — | Logs exist, metrics needed |

---

## Key Insights

### What's Working Well
1. **Multi-tenant isolation** — Org/user scoping prevents data leaks
2. **Deduplication** — SHA-256 index saves 50–80% storage per org
3. **Robust validation** — 11-step pipeline catches spoofed files, oversized uploads, quota breaches
4. **Graceful degradation** — Failed image fetch → text pointer block (run doesn't crash)
5. **LRU eviction** — Automatic cleanup when quota exceeded

### Critical Dependencies
1. **S3 presigner** — Reused from artifact-storage plugin (consistent across system)
2. **PostgreSQL advisory locks** — Prevent concurrent cleanup runs
3. **Sharp library** — Image resizing + EXIF stripping (lazy-loaded to avoid bloat)

### Token Economy
- **Large file inlining**: 97% token savings (60K → 1.8K tokens per 5-turn conversation)
- **Presigned URL caching**: Avoids regeneration cost on every run

---

## Files Mentioned in Status Document

**Backend (Agent-Server):**
- `services/agent-server/src/routes/attachments.route.ts`
- `services/agent-server/src/services/attachment.service.ts`
- `services/agent-server/src/repositories/user-attachment.repository.ts`
- `services/agent-server/src/services/attachment-cleanup.service.ts`
- `services/agent-server/src/routes/runs.route.ts`
- `services/agent-server/src/routes/threads.route.ts`
- `services/agent-server/tests/integration/artifacts.test.ts`
- `services/agent-server/tests/integration/runs-with-attachments.test.ts`
- `services/agent-server/tests/unit/services/attachment-cleanup.service.test.ts`
- `services/agent-server/src/main.ts` ← **WHERE TO ADD CLEANUP PLUGIN**

**Backend (Worker):**
- `services/worker-ts-new/src/services/attachment.service.ts`
- `services/worker-ts-new/src/utils/build-attachment-blocks.ts`
- `services/worker-ts-new/src/jobs/orchestrator-types.ts`
- `services/worker-ts-new/src/jobs/agent-run-orchestrator.ts`
- `services/worker-ts-new/src/jobs/run.processor.ts`
- `services/worker-ts-new/tests/unit/services/attachment.service.test.ts`

**Frontend (React):**
- `client/react-chat/src/components/AttachmentUploadPicker.tsx`
- `client/react-chat/src/components/AttachmentUploadPicker.test.tsx`
- `client/react-chat/src/pages/DeepAgentChat/ChatView.tsx`
- `client/react-chat/src/pages/DeepAgentChat/components/ChatInput.tsx`
- `client/react-chat/src/pages/DeepAgentChat/components/MessageRow.tsx`
- `client/react-chat/src/lib/api/attachments.ts`
- `client/react-chat/src/lib/api/attachments.test.ts`

**Shared:**
- `services/shared/src/db/schema/user-attachments.ts`
- `services/shared/src/attachments/` — Validation utilities
- `services/shared/src/artifact-storage/` — S3 presigning

---

**End of Analysis**
