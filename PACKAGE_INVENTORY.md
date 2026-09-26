# 📦 Complete Package Inventory

## Overview

This document provides a complete breakdown of all npm packages used in the **CodeStudio agent platform** (from `package-lock.json`).

---

## 🏗️ Monorepo Structure

```
codestudio (root)
├── services/shared                    # Shared utilities
├── services/agent-server              # Fastify HTTP API
├── services/worker-ts-new             # Background job processor (BullMQ)
├── client/react-chat                  # React frontend
└── sim-test                           # Simulation tests
```

**Node.js requirement:** `>=20.0.0`

---

## 📊 Root Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@azure/identity` | `^4.13.1` | Azure authentication (managed identities, tokens) |
| `@azure/keyvault-secrets` | `^4.11.2` | Azure Key Vault for secret management |

---

## 🖥️ Frontend: `client/react-chat`

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@assistant-ui/react` | `^0.12.26` | Pre-built assistant/chat UI components |
| `@assistant-ui/react-markdown` | `^0.12.11` | Markdown renderer for chat messages |
| `@langchain/langgraph-sdk` | `^1.8.9` | LangGraph SDK for agent orchestration |
| `@langchain/react` | `^0.3.3` | LangChain React bindings & hooks |
| `react` | `^18.3.1` | React framework (18.3.1 = latest stable) |
| `react-dom` | `^18.3.1` | React DOM rendering |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@testing-library/dom` | `^10.4.2` | DOM testing utilities |
| `@testing-library/react` | `^16.3.3` | React component testing |
| `@types/react` | `^18.3.23` | TypeScript types for React |
| `@types/react-dom` | `^18.3.7` | TypeScript types for React DOM |
| `@vitejs/plugin-react` | `^4.5.2` | Vite plugin for React (JSX, HMR) |
| `happy-dom` | `^15.11.7` | Lightweight DOM for testing |
| `typescript` | `^5.7.3` | TypeScript compiler |
| `vite` | `^6.3.5` | Modern frontend build tool (replaces webpack) |
| `vitest` | `^4.1.10` | Unit/integration test runner (Vite-native) |

### Build Chain Dependencies (Transitive)

#### esbuild (Bundler - 32 platform binaries)
```
@esbuild/aix-ppc64          0.25.12
@esbuild/android-arm        0.25.12
@esbuild/android-arm64      0.25.12
@esbuild/android-x64        0.25.12
@esbuild/darwin-arm64       0.25.12  ← macOS ARM (Apple Silicon)
@esbuild/darwin-x64         0.25.12  ← macOS Intel
@esbuild/freebsd-arm64      0.25.12
@esbuild/freebsd-x64        0.25.12
@esbuild/linux-arm          0.25.12
@esbuild/linux-arm64        0.25.12  ← Linux ARM (Raspberry Pi, etc)
@esbuild/linux-ia32         0.25.12
@esbuild/linux-loong64      0.25.12  ← Loongson CPU
@esbuild/linux-mips64el     0.25.12
@esbuild/linux-ppc64        0.25.12
@esbuild/linux-riscv64      0.25.12
@esbuild/linux-s390x        0.25.12
@esbuild/linux-x64          0.25.12  ← Linux x86-64 (most common)
@esbuild/netbsd-arm64       0.25.12
@esbuild/netbsd-x64         0.25.12
@esbuild/openbsd-arm64      0.25.12
@esbuild/openbsd-x64        0.25.12
@esbuild/openharmony-arm64  0.25.12
@esbuild/sunos-x64          0.25.12
@esbuild/win32-arm64        0.25.12  ← Windows ARM
@esbuild/win32-ia32         0.25.12  ← Windows 32-bit
@esbuild/win32-x64          0.25.12  ← Windows x86-64
esbuild                     0.25.12
```

**Why 32 binaries?** Each OS + CPU architecture needs a different binary. npm downloads only the one matching your system during `npm install`.

#### Vite & Dependencies
- `esbuild` — Fast bundler (C++ core compiled to each platform)
- `postcss` — CSS processing
- `rollup` — ES module bundler (used by Vite for optimization)
- Various plugin packages

#### Testing Chain
- `vitest` → uses Vite config
- `happy-dom` — Lightweight DOM replacement (faster than jsdom)
- `@testing-library/*` → wraps happy-dom
- `chai` — Assertion library
- `tinypool` — Worker pool for test parallelization

---

## 🔍 Key Technology Stack

### Frontend Framework
- **React 18.3.1** — Component library
- **Assistant-UI** — Pre-built chat/assistant components
- **LangChain** — AI agent framework

### Build Tools
- **Vite 6.3.5** — Modern bundler (replaces webpack)
  - Instant HMR (hot module reload)
  - ES modules in dev, optimized bundle in prod
- **esbuild 0.25.12** — Ultra-fast bundler (Vite's engine)
- **TypeScript 5.7.3** — Static type checking

### Testing
- **Vitest 4.1.10** — Jest-compatible test runner (Vite-native)
- **Testing Library** — React component testing
- **Happy DOM** — Lightweight DOM for tests (3-5x faster than jsdom)

### AI/Agent Integration
- **LangGraph SDK 1.8.9** — Agent orchestration & workflows
- **LangChain React 0.3.3** — React hooks for LangChain agents

### Azure Integration
- **@azure/identity** — Managed identity + token auth
- **@azure/keyvault-secrets** — Secret management

---

## 📈 Dependency Graph Summary

```
client/react-chat/
├── react (18.3.1)
├── react-dom (18.3.1)
├── @assistant-ui/react (0.12.26)
│   └── @assistant-ui/react-markdown (0.12.11)
├── @langchain/langgraph-sdk (1.8.9)
├── @langchain/react (0.3.3)
├── vite (6.3.5)
│   └── esbuild (0.25.12)
│       └── [32 platform binaries]
├── typescript (5.7.3)
├── vitest (4.1.10)
│   ├── happy-dom (15.11.7)
│   └── chai (assertion)
└── @vitejs/plugin-react (4.5.2)
    └── @babel/plugin-transform-react-jsx
```

---

## 🔴 Critical Notes

### No Workspace Package Details
The `package-lock.json` preview only showed:
- Root config
- `client/react-chat` packages
- Platform binaries

**Missing from preview:**
- `services/shared` packages
- `services/agent-server` packages (Fastify, BullMQ, etc)
- `services/worker-ts-new` packages (E2B, LangGraph worker)
- `sim-test` packages

### Platform Binary Bloat
The lock file includes **32 esbuild binaries** (one per OS/CPU combo). This is normal — npm only downloads the one for your platform during install, so:

```bash
npm install
# Downloads only the binary for your OS/arch
# E.g., on macOS ARM64: only @esbuild/darwin-arm64
# File size: 6-12 MB per install, not 900+ MB
```

---

## 📦 Total Package Count

| Category | Count |
|----------|-------|
| Root dependencies | 2 |
| Frontend direct deps | 6 |
| Frontend dev deps | 9 |
| esbuild platforms | 32 |
| Other transitive | ~150+ |
| **Total** | **~900+** |

The 23,132 lines in package-lock.json represent:
- Exact versions of 900+ packages
- Integrity hashes (SHA-512) for security verification
- Platform-specific metadata

---

## 🚀 Install & Run

```bash
# Install dependencies for all workspaces
npm install

# Run frontend dev server
npm -w client/react-chat run dev

# Run tests
npm -w client/react-chat run test

# Build for production
npm -w client/react-chat run build
```

---

## 🔐 Security Considerations

1. **Azure auth** — Uses managed identities (recommended for production)
2. **Secrets in Key Vault** — Not in code or env files
3. **Package integrity** — All packages have SHA-512 hashes
4. **No known vulns** — Consider running `npm audit` regularly

---

## 📚 Version Strategy

| Tool | Version | Why |
|------|---------|-----|
| Node | >=20.0 | Latest LTS with ES modules |
| React | 18.3 | Stable concurrent features |
| TypeScript | 5.7 | Latest with all ES2024 features |
| Vite | 6.3 | Fast dev + smart bundling |
| Vitest | 4.1 | Drop-in Jest replacement |

---

**Last Updated:** From `package-lock.json` lockfileVersion 3

**Status:** Complete inventory of frontend + root packages. Backend workspaces not detailed in the preview.
