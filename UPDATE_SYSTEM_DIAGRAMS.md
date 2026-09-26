# Windows Auto-Update System - Visual Diagrams & Flowcharts

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        User Application                                 │
│                      (SFCode / VSCode)                                  │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ (injects)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    IUpdateService Interface                             │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  state: State                                                    │  │
│  │  onStateChange: Event<State>                                    │  │
│  │  checkForUpdates(explicit): Promise                             │  │
│  │  downloadUpdate(explicit): Promise                              │  │
│  │  applyUpdate(): Promise                                         │  │
│  │  quitAndInstall(): Promise                                      │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                              △
                              │ (implements)
                              │
        ┌─────────────────────┼─────────────────────────────┐
        │                     │                             │
        │                     │                             │
┌───────┴────────┐  ┌─────────┴──────────┐  ┌──────────────┴──────────┐
│ Abstract       │  │ Win32Update       │  │ SnapUpdateService      │
│ UpdateService  │  │ Service           │  │                        │
│                │  │ (Windows)         │  │ (Linux Snap)           │
│ - State mgmt   │  │ - Inno Setup      │  │ - snapd API            │
│ - Scheduling   │  │ - Cache mgmt      │  │ - Snap refresh         │
│ - Server calls │  │ - Session safety  │  │ - Auto-refresh         │
│ - Lifecycle    │  │ - Auto-install    │  │                        │
└────────────────┘  └───────────────────┘  └────────────────────────┘

                    Service Dependencies
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  IConfigurationService  → update.mode, enableBackgroundUpdates        │
│  IProductService        → version, commit, updateUrl, quality, target │
│  IRequestService        → HTTP calls to update server                 │
│  ILogService            → Logging & debugging                         │
│  ILifecycleMainService  → App quit/restart coordination               │
│  IMeteredConnectionService → Detect slow/paid networks                │
│  IApplicationStorageMainService → Persist update metadata              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. State Machine Diagram

```
                          ┌───────────────────────┐
                          │   Uninitialized       │
                          │  (Just created)       │
                          └───────────┬───────────┘
                                      │
                                      │ initialize()
                                      ▼
                          ┌───────────────────────┐
                          │      Disabled         │◄─────────────┐
                          │  (Config/Policy)      │              │
                          └───────────────────────┘      Error or disabled
                                      │                 by policy
                        ┌─────────────┼─────────────┐
                        │ Config OK   │             │
                        ▼             ▼             ▼
                    ┌────────────────────────┐  ┌──────────────┐
                    │     Idle               │  │   Disabled   │
                    │  (Ready to check)      │  │   (Error)    │
                    └────────────────────────┘  └──────────────┘
                        │                 │
                        │                 │ (every 60 min or manual)
                        ▼                 ▼
                    ┌────────────────────────────┐
                    │ CheckingForUpdates         │
                    │ (HTTP request in progress) │
                    └────────┬───────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────┴───────┐           ┌────┴───────────┐
         │ No Update    │           │  Update Found  │
         │ (204)        │           │  (200 + data)  │
         ▼              ▼           ▼                ▼
    ┌────────────────────────┐  ┌────────────────────────┐
    │      Idle              │  │ AvailableForDownload   │
    │  (Stay idle)           │  │  (Update available)    │
    └────────────────────────┘  └────────┬───────────────┘
                                         │
                                         │ downloadUpdate()
                                         ▼
                                ┌────────────────────────┐
                                │   Downloading          │
                                │  (Streaming .exe)      │
                                │  (Verify checksum)     │
                                └────────┬───────────────┘
                                         │
                                ┌────────┴────────┐
                                │                 │
                        ┌───────┴──────┐      ┌───┴────────────────┐
                        │ Auto-install?│      │  Checksum error?   │
                        │  enabled?    │      │  Download failed?  │
                        ▼              ▼      ▼                    ▼
                    ┌────────────┐   ┌──────────────┐        ┌───────────┐
                    │ Downloaded │   │    Idle      │        │   Idle    │
                    │            │   │  (error msg) │        │(error msg)│
                    └────┬───────┘   └──────────────┘        └───────────┘
                         │
                    ┌────┴─────────┐
                    │              │
            ┌───────┴──────┐   ┌───┴───────────┐
            │ Auto-install?│   │  User wants  │
            │              │   │  to install  │
            ▼              ▼   ▼              ▼
        ┌──────────┐   ┌─────────────┐
        │ Updating │   │    Ready    │
        │          │   │  (ready to  │
        │(installing)  │   restart)  │
        └────┬─────┘   └──────┬──────┘
             │                │
             │                │ quitAndInstall()
             ▼                ▼
        ┌──────────────────────────────┐
        │  Restarting                  │
        │  (App closing, installer     │
        │   finishing, relaunching)    │
        └──────────────────────────────┘
             │
             │ (app relaunches with new version)
             ▼
        ┌──────────────────────────────┐
        │  SUCCESS ✅                   │
        │  Running new version         │
        └──────────────────────────────┘
```

---

## 3. Update Download Process Flow

```
                    START
                     │
                     ▼
        ┌────────────────────────┐
        │ State: Downloaded      │
        │ check() triggered      │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │ Determine Update Type                  │
        │ unins000.exe exists?                   │
        └────────┬────────────────────────────────┘
                 │
     ┌───────────┴──────────────┐
     │                          │
    YES                         NO
     │                          │
     ▼                          ▼
┌──────────────────┐  ┌────────────────────────┐
│ Setup Install    │  │ Archive/Portable       │
│ (System-wide)    │  │ (User-local)           │
└────┬─────────────┘  └────────┬───────────────┘
     │                         │
     ▼                         ▼
┌──────────────────────────────────────────────┐
│ Is setupUrl available?                       │
│ (Update server provided alternate URL?)      │
└────┬──────────────────────────┬──────────────┘
     │ YES                      │ NO
     ▼                          ▼
┌─────────────────┐   ┌──────────────────────┐
│ Open setupUrl   │   │ Use url parameter    │
│ externally      │   │ Download .exe to:    │
│ (browser)       │   │                      │
└─────────────────┘   │ ${TEMP}/Sfcode-.../ │
                      │ SFCodeSetup-v.exe    │
     │                └────────┬─────────────┘
     │                         │
     │                         ▼
     │                ┌─────────────────────┐
     │                │ Download via HTTP   │
     │                │ Stream to temp file │
     │                │ Track progress      │
     │                └────────┬────────────┘
     │                         │
     │                         ▼
     │                ┌─────────────────────┐
     │                │ Verify SHA256       │
     │                │ vs expected hash    │
     │                └────────┬────────────┘
     │                         │
     │              ┌──────────┴──────────┐
     │              │                     │
     │        Match? YES                  NO (corrupted)
     │              │                     │
     │              ▼                     ▼
     │       ┌─────────────┐      ┌──────────────────┐
     │       │ State:      │      │ State: Idle      │
     │       │ Downloaded  │      │ Error: Checksum  │
     │       └────┬────────┘      │ mismatch         │
     │            │               └──────────────────┘
     │            ▼
     │   ┌────────────────────────────────┐
     │   │ Next step?                     │
     │   │ Check auto-install settings    │
     │   └────────┬───────────────────────┘
     │            │
     ▼            ▼
┌──────────────────────────┐
│ Auto-install Enabled?    │
│ (Windows Background      │
│  Updates setting)        │
└────┬───────────┬─────────┘
     │           │
    YES          NO
     │           │
     ▼           ▼
┌──────────────┐ ┌─────────────────┐
│ doApply      │ │ State: Ready    │
│ Update()     │ │ (wait for user) │
│              │ │                 │
│ State:       │ │ OR              │
│ Updating     │ │ User clicks     │
└──┬───────────┘ │ "Install &      │
   │             │ Restart"        │
   │             └────────┬────────┘
   │                      │
   └──────────┬───────────┘
              │
              ▼
         ┌──────────────┐
         │ doApply      │
         │ Update()     │
         │              │
         │ Spawn Inno   │
         │ Setup with:  │
         │ /verysilent  │
         │ /update=flag │
         │ /progress... │
         │ /cancel...   │
         └──────┬───────┘
                │
                ▼
          ┌────────────────┐
          │ State: Updating│
          │ (installer     │
          │  running)      │
          └────────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │ Installer      │
          │ finishes       │
          └────────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │ State: Ready   │
          │ (ready to      │
          │  restart)      │
          └────────┬───────┘
                   │
                   ▼
          ┌────────────────┐
          │ User restarts  │
          │ (or scheduled) │
          └────────┬───────┘
                   │
                   ▼
              ┌─────────┐
              │ SUCCESS │
              └─────────┘
```

---

## 4. HTTP Request/Response Sequence

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  App Update Service                    Update Server                   │
│      │                                       │                         │
│      │  GET /api/update/win32/stable/abc123  │                         │
│      ├──────────────────────────────────────>│                         │
│      │  Headers: User-Agent: Code/1.2 ...    │                         │
│      │           Cache-Control: no-cache     │                         │
│      │                                       │                         │
│      │  Query: u=organization&bg=false       │                         │
│      │                                       │                         │
│      │                    HTTP 200 OK        │                         │
│      │<──────────────────────────────────────┤                         │
│      │                                       │                         │
│      │  {                                    │                         │
│      │    "version": "1.2.3",                │                         │
│      │    "url": "https://.../Setup-1.2.3.exe",                        │
│      │    "sha256hash": "e3b0c44298...",    │                         │
│      │    "setupUrl": "https://.../setup",   │                         │
│      │    "isUpdateForSFUsers": true         │                         │
│      │  }                                    │                         │
│      │                                       │                         │
│      ├─ Parse JSON ─┐                        │                         │
│      │              │                        │                         │
│      │              ├─ Extract version       │                         │
│      │              ├─ Compare: v1.2.3 >    │                         │
│      │              │           v1.2.2?     │                         │
│      │              ├─ Check isUpdateFor    │                         │
│      │              │ SFUsers flag          │                         │
│      │              │                        │                         │
│      │<─────────────┤                        │                         │
│      │                                       │                         │
│      ├─ State: AvailableForDownload          │                         │
│      │                                       │                         │
│      ├─ Download /update.url                 │                         │
│      ├──────────────────────────────────────>│                         │
│      │ Stream: SFCodeSetup-1.2.3.exe (50MB) │                         │
│      │<──────────────────────────────────────┤                         │
│      │                                       │                         │
│      ├─ Verify SHA256                        │                         │
│      │ Expected: e3b0c44298...              │                         │
│      │ Actual:   e3b0c44298...              │                         │
│      │ ✅ Match!                              │                         │
│      │                                       │                         │
│      ├─ State: Downloaded                    │                         │
│      │                                       │                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cache Directory Structure

```
C:\Users\{user}\AppData\Local\Temp\
│
└─ Sfcode-stable-user-x64/              (Main cache directory)
   │
   ├─ 1.2.0/                           (Version-specific subdirectories)
   │  ├─ SFCodeSetup-stable-1.2.0.exe
   │  └─ 1.2.0.flag                    (marks this version as pending)
   │
   ├─ 1.2.1/
   │  ├─ SFCodeSetup-stable-1.2.1.exe
   │  └─ 1.2.1.flag
   │
   ├─ 1.2.2/
   │  └─ SFCodeSetup-stable-1.2.2.exe  (installed, no .flag)
   │
   ├─ 1.2.3/                           (Currently downloading)
   │  ├─ SFCodeSetup-stable-1.2.3.exe  (in progress)
   │  └─ 1.2.3.flag                    (created once download done)
   │
   ├─ SFCodeSetup-stable-1.2.2.exe     (Symlink or copy of current)
   │
   ├─ session-ending.flag              (Session marker - created
   │                                    before restart to enable
   │                                    recovery if crash)
   │
   ├─ cancel.flag                      (Abort signal - installer
   │                                    monitors and cancels if exists)
   │
   ├─ update-progress                  (Progress file - installer
   │                                    writes progress percentage)
   │
   └─ updating_version                 (Current version being
                                        installed)

Legend:
  .exe files        = Installer executables
  .flag files       = Markers to signal pending updates
  session-ending    = Recovery marker
  cancel.flag       = Abort signal
  update-progress   = Real-time progress tracking
```

---

## 6. Configuration Decision Tree

```
                  ┌─ Update Configuration ─┐
                  │                        │
                  ▼
        ┌──────────────────────┐
        │ update.mode?         │
        └──────────────────────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
   "none"   "manual" "start" "default"
    │        │        │        │
    ▼        ▼        ▼        ▼
┌─────┐  ┌──────┐  ┌────┐  ┌────────┐
│ OFF │  │MANUAL│  │ONCE│  │PERIODIC│
└─────┘  └──────┘  └────┘  └────────┘
    │        │        │        │
    │        │        │        │
    ▼        ▼        ▼        ▼
 Don't    User      Check   Check
 check    must      only at  every
 for      click     startup  60 mins
 updates  button
    │        │        │        │
    └────────┼────────┼────────┘
             │        │
             ▼        ▼
         ┌─────────────────────┐
         │ If Update Found:    │
         │ Check               │
         │ enableWindowsBg     │
         │ Updates?            │
         └─────────────────────┘
              │
        ┌─────┴─────┐
        │           │
       YES          NO
        │           │
        ▼           ▼
  ┌──────────┐  ┌──────────┐
  │Auto-     │  │Download  │
  │install   │  │only      │
  │(silent)  │  │(wait for │
  │          │  │ user to  │
  │Download+ │  │ restart) │
  │Install+  │  │          │
  │Restart   │  │Download+ │
  │without   │  │Show      │
  │prompting │  │"Restart" │
  │          │  │button    │
  └──────────┘  └──────────┘
```

---

## 7. Error Handling Flow

```
                  ┌─ Update Process ─┐
                  │                  │
                  ▼
        ┌─────────────────────┐
        │ Network Error?      │
        │ (No internet)       │
        └────┬────────────────┘
             │
          YES│              NO
             ▼              │
      ┌─────────────┐       │
      │ State: Idle │       │
      │ Error: "... │       │
      │ Connection" │       │
      └─────────────┘       │
                            ▼
        ┌────────────────────────────────┐
        │ Invalid Server Response?       │
        │ (JSON parse error)             │
        └────┬───────────────────────────┘
             │
          YES│              NO
             ▼              │
      ┌─────────────────┐   │
      │ State: Idle     │   │
      │ Error: "Invalid"│   │
      └─────────────────┘   │
                            ▼
        ┌──────────────────────────────┐
        │ Download Failed?             │
        │ (Network interrupted)        │
        └────┬───────────────────────────┘
             │
          YES│              NO
             ▼              │
      ┌─────────────────┐   │
      │ State: Idle     │   │
      │ Error: "Download│   │
      │ failed"         │   │
      └─────────────────┘   │
                            ▼
        ┌──────────────────────────────┐
        │ SHA256 Checksum Match?       │
        │ (Detect corruption/tampering)│
        └────┬───────────────────────────┘
             │
            NO│              YES
             ▼              │
      ┌─────────────────┐   │
      │ State: Idle     │   │
      │ Error: "Checksum│   │
      │ mismatch"       │   │
      │ (Corrupted)     │   │
      └─────────────────┘   │
                            ▼
        ┌──────────────────────────────┐
        │ Installer Start Failed?      │
        │ (Can't spawn process)        │
        └────┬───────────────────────────┘
             │
          YES│              NO
             ▼              │
      ┌─────────────────┐   │
      │ State: Idle     │   │
      │ Error: "Failed  │   │
      │ to start        │   │
      │ installer"      │   │
      └─────────────────┘   │
                            ▼
        ┌──────────────────────────────┐
        │ Installer Process Failed?    │
        │ (Non-zero exit code)         │
        └────┬───────────────────────────┘
             │
          YES│              NO
             ▼              │
      ┌─────────────────┐   │
      │ State: Idle     │   │
      │ Error: "Install │   │
      │ failed: <code>" │   │
      └─────────────────┘   │
                            ▼
                       ┌────────────┐
                       │ SUCCESS ✅ │
                       └────────────┘
```

---

## 8. Complete State Diagram with All Transitions

```
                           ┌──────────────┐
                           │Uninitialized │
                           └──────┬───────┘
                                  │initialize()
                                  ▼
        ┌─────────────────────────────────────────┐
        │                                         │
        │  Validate Config                       │
        │  ├─ isBuilt?                           │
        │  ├─ disableUpdates?                    │
        │  ├─ updateUrl exists?                  │
        │  ├─ commit exists?                     │
        │  └─ update.mode policy?                │
        │                                         │
        └─────────┬───────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
      VALID                INVALID
        │                    │
        ▼                    ▼
    ┌───────┐          ┌──────────┐
    │ Idle  │          │ Disabled │
    └───┬───┘          └──────────┘
        │
        │ (schedule initial check)
        │ (T+30 seconds)
        ▼
    ┌────────────────────────┐
    │ CheckingForUpdates     │
    │ (HTTP GET request)     │
    └────┬──────────────────┘
         │
    ┌────┴────────────────┐
    │                     │
  204 NoContent        200 OK + JSON
  (No update)          (Update found)
    │                     │
    ▼                     ▼
 ┌─────────┐         ┌──────────────────────┐
 │  Idle   │         │ AvailableForDownload │
 │(schedule│         └──────┬───────────────┘
 │ retry)  │                │
 └─────────┘      downloadUpdate() [auto or manual]
                           │
                           ▼
                    ┌───────────────┐
                    │  Downloading  │
                    │ [progress     │
                    │  tracking]    │
                    └───┬───────────┘
                        │
                ┌───────┴────────┐
                │                │
            Success          Failure
                │                │
                ▼                ▼
        ┌────────────────┐   ┌────────┐
        │  Downloaded    │   │  Idle  │
        └────┬───────────┘   │(w/error│
             │               │message)│
             │               └────────┘
        applyUpdate()
         │
         ▼
    ┌────────────┐
    │ Updating   │ [installer running]
    │(installer  │
    │ spawned)   │
    └──────┬─────┘
           │
       [installer finishes]
           │
           ▼
    ┌─────────────┐
    │  Ready      │ [restart needed]
    │(installer   │
    │ done, app   │
    │ needs       │
    │ restart)    │
    └──────┬──────┘
           │
      quitAndInstall()
           │
           ▼
    ┌──────────────┐
    │ Restarting   │ [app closing,
    │              │  installer finishing,
    │              │  relaunching]
    └──────┬───────┘
           │
    [new version launches]
           │
           ▼
    ┌──────────────┐
    │  SUCCESS ✅   │ [running new version]
    └──────────────┘
           │
        [continues normal operation]
           │
        [T+60 min]
           │
           ▼ (schedule next check)
    Back to CheckingForUpdates
```

---

## 9. Windows vs Other Platforms

```
                    IUpdateService Interface
                           (contract)
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
            Windows         macOS         Linux (Snap)
            (win32)        (darwin)       (snap)
              │             │             │
              │             │             │
        ┌─────┴─────┐   ┌───┴───┐   ┌────┴────┐
        │            │   │        │   │         │
        │ Windows-   │   │ macOS- │   │ Snap-   │
        │ Specific   │   │Specific│   │Specific │
        │            │   │        │   │         │
        ├─ Setup vs │   ├─ Dmg vs │   ├─ snap   │
        │  Archive  │   │  Archive│   │ refresh │
        │ (Inno Setup)  │ (Codesign)  │         │
        │            │   │        │   │         │
        ├─ Background│   │ Sparkle│   ├─ daemon │
        │ install   │   │(auto   │   │ process │
        │           │   │updater)│   │         │
        │           │   │        │   │         │
        ├─ Session  │   │ Xattr  │   ├─ snap   │
        │ recovery  │   │changes │   │ store   │
        │           │   │        │   │         │
        ├─ UAC      │   ├─ Code  │   ├─ auto   │
        │ prompts   │   │signing │   │ refresh │
        │(system    │   │& notary│   │ enabled │
        │ target)   │   │        │   │         │
        └───────────┘   └────────┘   └─────────┘

Key differences:
• Windows: Uses Inno Setup, session recovery, UAC support
• macOS: Uses Sparkle framework, code signing, quarantine attrs
• Linux: Uses snap daemon, direct refresh mechanism
```

---

## 10. Monthly Update Cycle Timeline

```
Week 1: Development & Testing
├─ Developers commit code
├─ Build pipeline runs
└─ Beta testing on insiders channel

Week 2: Release Preparation
├─ Feature freeze
├─ Release candidate builds
├─ QA final testing
└─ Build approval

Week 3: Release Day
├─ Publish final binary to update server
│  ├─ v1.2.3.exe uploaded
│  ├─ SHA256 hash computed
│  └─ Update feed endpoint configured
│
├─ 00:00 UTC - Update goes live
│  ├─ /api/update/win32/stable/abc123
│  │  returns HTTP 200 with v1.2.3 metadata
│  │
│  ├─ User 1 checks at T+30min
│  │  ├─ Download starts
│  │  └─ Install queued
│  │
│  ├─ User 2 checks at T+60min
│  │  ├─ Download starts
│  │  └─ Background install (if enabled)
│  │
│  └─ User 3 checks manually
│      ├─ Download + Install
│      └─ Restart to complete
│
└─ Monitor:
    ├─ Update adoption rates
    ├─ Error telemetry
    ├─ Rollback if critical issue found
    └─ Update release notes in app

Week 4: Stabilization
├─ First hotfix if needed (v1.2.4)
│  └─ Same process, abbreviated
├─ Prepare next version
│  └─ Start cycle again
└─ Collect user feedback
```

---

## Summary

These diagrams show:
1. **Architecture** - How components fit together
2. **State Machine** - All possible states and transitions
3. **Download Flow** - What happens during download
4. **Network** - HTTP request/response protocol
5. **Cache** - Filesystem structure
6. **Configuration** - Decision tree for settings
7. **Errors** - Error handling paths
8. **Complete States** - All transitions
9. **Platform Differences** - Windows vs other OS
10. **Timeline** - Monthly cycle

