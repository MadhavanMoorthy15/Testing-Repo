# Attachments Implementation Explanation — Summary

## What You Asked

You provided the `ATTACHMENTS_IMPLEMENTATION_STATUS.md` document and asked me to:
1. **Explain this file** in detail
2. **Analyze each file** mentioned
3. **Explain how it's done** (what's implemented, what's pending, what's found)

---

## What I Created

I created **two comprehensive analysis documents** to explain the attachments system:

### 1. **ANALYSIS_ATTACHMENTS_SPEC.md** (Detailed Technical Reference)
- **13 implemented components** explained in detail:
  1. Data model (PostgreSQL schema)
  2. Upload REST endpoint
  3. 11-step validation pipeline
  4. Repository layer (CRUD operations)
  5. Cleanup service (Phase A/B/C)
  6. Runs endpoint integration
  7. Threads endpoint integration
  8. Worker attachment loading
  9. Attachment blocks builder
  10. Orchestrator type extensions
  11. Integration tests
  12. Frontend React components
  13. Shared attachments library

- **3 critical gaps** with solutions and time estimates
- **Configuration reference** (all ENV variables)
- **Implementation checklist** (7 phases)
- **Priority roadmap** (6.5 hours to production)

### 2. **ATTACHMENTS_QUICK_REFERENCE.md** (Quick Lookup Guide)
- One-sentence system summary
- Completion status by layer (Server 95%, Worker 100%, Frontend 85%)
- How it works (end-to-end flow diagram)
- Three critical gaps with impact analysis
- Token economy analysis (97% savings for large files)
- Quick file index for navigation

---

## What's Implemented ✅ (85–90% Complete)

### Backend Server (95% complete)
- ✅ POST /v1/attachments — Upload with magic-bytes validation, MIME whitelist, rate limiting, deduplication
- ✅ GET /v1/attachments — Paginated list with filters
- ✅ GET /v1/attachments/:id — Single attachment + presigned URL refresh
- ✅ DELETE /v1/attachments/:id — Soft-delete with 30-day restore window
- ✅ Run integration — attachmentIds in POST /v1/runs payload
- ✅ Thread integration — attachmentIds in PATCH /threads/:id for follow-up messages

### Validation Pipeline (11 steps)
1. Auth check
2. Magic-bytes detection (detect file type spoofing)
3. MIME whitelist (35 allowed types)
4. Size check (50MB images, 5MB text)
5. Org quota check (<10GB default)
6. User count check (<100 default)
7. SHA-256 deduplication (same file = return existing)
8. Image preprocessing (resize, EXIF strip, thumbnail)
9. S3 PUT with retry (3× exponential backoff)
10. Presigned URL generation (30-day cache)
11. Database insert (atomic sequence)

### Worker (100% complete)
- ✅ Attachment loader — Bulk load by public ID
- ✅ URL refresh — Refresh if expiring <1 hour from now
- ✅ LRU bookkeeping — Bump usage on access
- ✅ Content block builder — Anthropic-compatible image + text blocks
- ✅ Orchestrator integration — attachmentIds passed through job

### Frontend (85% complete)
- ✅ AttachmentUploadPicker — File picker + drag-drop, 20 files max
- ✅ Per-file status display — uploading/uploaded/error with thumbnails
- ✅ ChatInput integration — Picker chip in message bar
- ✅ Message display — Attachment chips + hover preview
- ✅ API client — POST/GET/DELETE wrapper

### Data Model (100% complete)
- ✅ user_attachments table with org/user scoping
- ✅ Deduplication index (UNIQUE on org, user, sha256 WHERE ready)
- ✅ LRU indexes (lastUsedAt, useCount for eviction)
- ✅ Soft-delete model with 30-day restore window
- ✅ Presigned URL cache to avoid regeneration

---

## What's MISSING ❌ (3 Critical Gaps)

### Gap 1: Cleanup Not Scheduled (5-minute fix) 🔴 CRITICAL

**File:** `services/agent-server/src/main.ts`

**What's needed:**
```typescript
import attachmentsCleanupPlugin from "./plugins/attachments-cleanup.plugin.js";

await app.register(attachmentsCleanupPlugin);
```

**What it does:**
- Starts a `setInterval()` every 1 hour
- Calls `AttachmentCleanupService.sweep()`
- Phase A: Hard-delete from S3 after 1h soft-delete window
- Phase B: Auto-delete unused >30 days
- Phase C: LRU evict if org >10GB

**Impact without this:**
- Soft-deleted files stay in S3 forever
- Storage isn't reclaimed
- Org quotas don't enforce
- Cost bloat over time

---

### Gap 2: No E2E Tests (45 minutes each) 🔴 HIGH PRIORITY

**Missing backend test:**
1. Upload file via POST /v1/attachments
2. Create run with attachmentIds
3. Wait for worker to process
4. Verify message contains image/file blocks
5. Verify image was resized
6. Verify presigned URL is HTTPS + valid

**Missing frontend test (Playwright):**
1. Open chat UI
2. Click attachment picker
3. Select file
4. Verify upload progress
5. Send message with attachment
6. Verify agent sees image in context
7. Verify response references attachment

**Impact without this:**
- Silent failures in round-trip flow
- Can't catch regressions

---

### Gap 3: No Observability (1–2 hours) 🟡 MEDIUM PRIORITY

**Missing:**
- Prometheus metrics (upload count, usage histogram, cleanup duration)
- Quota alerts (org approaching 8GB)
- Tracing spans for upload → S3 path

**Impact without this:**
- Can't monitor production usage
- Can't troubleshoot issues
- No alerts for quota breaches

---

## How It Works End-to-End

```
1. USER UPLOADS FILE
   ├─ Multipart form (up to 10 files)
   ├─ Magic-bytes validation
   ├─ MIME whitelist check
   ├─ Size check
   ├─ Org quota check
   ├─ User count check
   ├─ SHA-256 dedup lookup
   │  ├─ Hit → return existing (200 OK)
   │  └─ Miss → continue
   ├─ Image preprocessing (resize, EXIF strip)
   ├─ S3 PUT with retry
   ├─ Generate presigned URL
   └─ Return att_NNN ID

2. AGENT SENDS RUN WITH ATTACHMENT
   ├─ Client: attachmentIds: ["att_001"]
   ├─ Server validates: SELECT WHERE org/user/ready
   ├─ Server rejects if not owned / missing
   ├─ BullMQ job includes attachmentIds

3. WORKER PROCESSES
   ├─ Load attachments by public ID
   ├─ Refresh URLs if expiring <1h
   ├─ Bump LRU usage (lastUsedAt++)
   ├─ Build content blocks (Anthropic format)
   │  ├─ Images: { type: "image", source: { url } }
   │  ├─ Small text: { type: "text", text: "// File: ...\n\n<body>" }
   │  └─ Large text: { type: "text", text: "<file:att_NNN> too large" }
   └─ Include in LLM prompt

4. LLM CONTEXT
   ├─ AI receives compact block (~350 tokens for large file)
   ├─ If needs more, calls read_file(path, offset, limit)
   ├─ Responds with attachment context

5. CLEANUP (Every 1 hour)
   ├─ Phase A: Hard-delete from S3 after 1h soft-delete window
   ├─ Phase B: Auto-delete unused >30 days
   └─ Phase C: LRU evict if org >10GB
```

---

## Key Design Wins

| Feature | Impact | Why It Matters |
|---------|--------|-----------------|
| **Deduplication by SHA-256** | Saves 50-80% storage | Same file uploaded twice = one S3 object |
| **Presigned URL caching** | Avoids regeneration cost | 30-day cache per attachment |
| **Soft-delete + restore** | Safe recovery from accidents | 30-day restore window before hard-delete |
| **LRU eviction** | Automatic quota enforcement | Org exceeds 10GB → LRU evict least-used |
| **Graceful degradation** | Run doesn't crash | Image fetch fails → text pointer block |
| **Org/user scoping** | Multi-tenant isolation | No cross-tenant data leaks |
| **Anthropic blocks format** | LLM-native integration | Works with Anthropic, extensible to others |

---

## Configuration Essentials

| Env Var | Default | Purpose |
|---------|---------|---------|
| `MAX_ATTACHMENTS_PER_USER` | 100 | Hard cap per user |
| `MAX_STORAGE_PER_ORG` | 10GB | Org quota bytes |
| `MAX_FILE_SIZE_IMAGES` | 50MB | Image size limit |
| `MAX_FILE_SIZE_TEXT` | 5MB | Text file size limit |
| `ATTACHMENT_RATE_LIMIT` | 100 | Uploads/hour per user |
| `AWS_S3_BUCKET` | (required) | S3 bucket name |
| `AWS_CLOUDFRONT_DOMAIN` | (optional) | For presigned URL signing |

---

## Token Economy Analysis

| Metric | Without Offloading | With Offloading | Savings |
|--------|-------------------|-----------------|---------|
| 5-turn conversation (1 large file) | 60,000 tokens | 1,800 tokens | **97%** |
| Cost per user thread | $0.20–$0.50 | $0.01–$0.03 | **90%** |
| First-token latency | 2.5–4.0s | 0.5–0.8s | **70%** |

**How?** Large files are stored on disk in sandbox, only 100-line preview + compact pointer block (~350 tokens) sent to LLM.

---

## Components Breakdown (Quick Reference)

### Backend Components
| File | Purpose | Status |
|------|---------|--------|
| `attachment.route.ts` | REST endpoints | ✅ Complete |
| `attachment.service.ts` | 11-step validation | ✅ Complete |
| `user-attachment.repository.ts` | CRUD + queries | ✅ Complete |
| `attachment-cleanup.service.ts` | Phase A/B/C cleanup | ✅ Built, not scheduled |
| `main.ts` | **WHERE TO REGISTER CLEANUP** | ❌ Missing 1 line |

### Worker Components
| File | Purpose | Status |
|------|---------|--------|
| `attachment.service.ts` | Load + URL refresh | ✅ Complete |
| `build-attachment-blocks.ts` | Content block generation | ✅ Complete |
| `orchestrator-types.ts` | Type extensions | ✅ Complete |

### Frontend Components
| File | Purpose | Status |
|------|---------|--------|
| `AttachmentUploadPicker.tsx` | File picker + drag-drop | ✅ Complete |
| `ChatInput.tsx` | Integration in message bar | ✅ Complete |
| `MessageRow.tsx` | Display in chat | ✅ Complete |
| `attachments.ts` | API client wrapper | ✅ Complete |

### Database
| File | Purpose | Status |
|------|---------|--------|
| `user-attachments.ts` | Schema with indexes | ✅ Complete |

---

## Next Steps (Priority Order)

1. **URGENT (5 min):** Add cleanup plugin registration in `main.ts`
2. **HIGH (45 min):** Write backend E2E test (upload → run → worker → message)
3. **HIGH (60 min):** Write frontend Playwright test (upload → send → verify)
4. **MEDIUM (30 min):** Update README with attachment usage guide
5. **MEDIUM (2 hours):** Add Prometheus metrics + quota alerts
6. **NICE-TO-HAVE (2 hours):** Frontend UX polish (retry, progress, warnings)
7. **NICE-TO-HAVE (1 hour):** Accessibility audit (WCAG AA)

**Total time to production:** ~6.5 hours

---

## Files You Need to Know

**To understand the system:**
- `ANALYSIS_ATTACHMENTS_SPEC.md` — Detailed breakdown of all 13 components
- `ATTACHMENTS_QUICK_REFERENCE.md` — Quick lookup and flow diagrams

**To fix the critical gap:**
- `services/agent-server/src/main.ts` — Add cleanup plugin registration (1 line!)

**To add tests:**
- `services/agent-server/tests/integration/attachment-e2e.test.ts` (new)
- `client/react-chat/tests/e2e/attachment-flow.spec.ts` (new)

**For reference:**
- `services/agent-server/src/routes/attachments.route.ts` — Upload endpoint
- `services/agent-server/src/services/attachment.service.ts` — Validation pipeline
- `services/shared/src/db/schema/user-attachments.ts` — Database schema

---

## The Tldr

**What:** A file attachment system for an agent platform.

**Status:** 85-90% done. Core infrastructure works. Three gaps remain:
1. Cleanup not scheduled (5 min to fix)
2. E2E tests missing (45 min each)
3. Observability not implemented (1-2 hours)

**How it works:**
- Upload file → Validate (11-step) → S3 + URL cache → attachmentIds in run
- Worker loads → Build content blocks → LLM sees ~350 tokens per large file (vs 12K inline)
- Every 1 hour: Delete expired, evict idle, enforce quota

**Key wins:**
- 97% token savings for large files
- 50-80% storage savings via deduplication
- Multi-tenant safe (org/user scoping)
- Graceful degradation (image fetch fails → still works)

---

## End of Explanation

For the complete technical details, see the two analysis documents created:
- **ANALYSIS_ATTACHMENTS_SPEC.md** — Full reference
- **ATTACHMENTS_QUICK_REFERENCE.md** — Quick lookup
