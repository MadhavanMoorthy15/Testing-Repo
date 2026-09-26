# Windows Auto-Update System - Interface Reference

## Core Interfaces

### 1. IUpdateService (Main Contract)

```typescript
interface IUpdateService {
  // State management
  readonly state: State;
  readonly onStateChange: Event<State>;
  
  // Update operations
  checkForUpdates(explicit: boolean): Promise<void>;
  downloadUpdate(explicit: boolean): Promise<void>;
  applyUpdate(): Promise<void>;
  quitAndInstall(): Promise<void>;
}
```

**What each method does:**
- `checkForUpdates()`: Contacts server to see if new version exists
- `downloadUpdate()`: Downloads the update package to cache
- `applyUpdate()`: Starts the installation process
- `quitAndInstall()`: Closes app and applies the update (used on restart)

---

### 2. State Interface

```typescript
// Current update status
interface State {
  type: StateType;
  update?: IUpdate;
  explicit?: boolean;
  updateType?: UpdateType;
  error?: string;
  notAvailable?: boolean;
}

// State types
enum StateType {
  Uninitialized,           // Not yet initialized
  Idle,                    // Ready to check
  CheckingForUpdates,      // HTTP request in progress
  AvailableForDownload,    // Update found, not yet downloading
  Downloading,             // Downloading .exe
  Downloaded,              // Download complete
  Updating,                // Installer running
  Ready,                   // Ready to restart
  Restarting,              // About to exit and restart
  Disabled,                // Updates disabled by config/policy
}

// How updates are delivered
enum UpdateType {
  Setup,    // Full installer (.exe with Inno Setup)
  Archive   // Portable version (.zip or similar)
}
```

---

### 3. IUpdate (Update Data)

```typescript
interface IUpdate {
  version: string;          // "1.2.3"
  url: string;             // Download URL for .exe
  sha256hash?: string;     // Checksum to verify integrity
}
```

**Extended for Syncfusion:**

```typescript
interface ISyncfusionUpdate extends IUpdate {
  setupUrl?: string;              // Alternative setup URL
  isUpdateForSFUsers?: boolean;   // Internal restriction flag
}
```

---

### 4. AvailableForDownload State Data

```typescript
interface AvailableForDownload {
  type: StateType.AvailableForDownload;
  update: IUpdate;
  explicit: boolean;       // User-triggered vs automatic
  updateType?: UpdateType; // Setup or Archive
}
```

---

## AbstractUpdateService (Base Implementation)

### Properties

```typescript
protected quality: string;                    // 'stable', 'insiders', etc.
protected _state: State;                      // Current state
protected _overwrite: boolean;                // Newer update pending
protected _internalOrg: string;               // Organization ID

// Configuration
protected configurationService: IConfigurationService;
protected productService: IProductService;
protected logService: ILogService;
protected lifecycleMainService: ILifecycleMainService;
protected meteredConnectionService: IMeteredConnectionService;
protected applicationStorageMainService: IApplicationStorageMainService;
```

### Key Methods

```typescript
// Public API
async checkForUpdates(explicit: boolean): Promise<void>
async downloadUpdate(explicit: boolean): Promise<void>
async applyUpdate(): Promise<void>
async quitAndInstall(): Promise<void>

// Protected methods (for subclasses)
protected abstract doDownloadUpdate(state: AvailableForDownload): Promise<void>
protected abstract doApplyUpdate(): Promise<void>
protected abstract doQuitAndInstall(): Promise<void>
protected abstract initialize(): Promise<void>

// Utility methods
protected setState(state: State): void
private scheduleCheckForUpdates(delay?: number): Promise<void>
private async checkForOverwriteUpdates(explicit?: boolean): Promise<boolean>
async isLatestVersion(commit?: string): Promise<boolean | undefined>
```

### State Transitions

```typescript
protected setState(state: State): void {
  // 1. Update internal state
  this._state = state;
  
  // 2. Notify listeners
  this._onStateChange.fire(state);
  
  // 3. Handle side effects
  if (state.type === StateType.Ready) {
    // Start checking for newer versions
    this.overwriteUpdatesCheckInterval.set(5 * 60 * 1000);
  }
}
```

---

## Win32UpdateService (Windows Implementation)

### Additional Properties

```typescript
// Cached data
private availableUpdate: IAvailableUpdate;  // Downloaded .exe info
private _cachedUpdateData: ISyncfusionUpdate;  // Update metadata

// File paths
private updateCachePath: string;            // TEMP/Sfcode-...
private updateFilePath: string;             // .flag file
private cancelFilePath: string;             // Cancellation flag
```

### IAvailableUpdate Structure

```typescript
interface IAvailableUpdate {
  packagePath: string;           // Full path to .exe
  updateFilePath?: string;       // .flag file path
  cancelFilePath?: string;       // Cancellation marker
  updateProcess?: ChildProcess;  // Running installer process
}
```

### Platform-Specific Methods

```typescript
// Override abstract methods
protected override async initialize(): Promise<void>
protected override async postInitialize(): Promise<void>
protected override async doDownloadUpdate(
  state: AvailableForDownload
): Promise<void>
protected override async doApplyUpdate(): Promise<void>
protected override async doQuitAndInstall(): Promise<void>

// Windows-specific utilities
async getVersionedCachePath(version?: string): Promise<string>
private async getUpdatePackagePath(version: string): Promise<string>
private async cleanup(exceptVersion?: string): Promise<void>
private saveUpdateMetadata(update: IUpdate): void
private async _applySpecificUpdate(packagePath: string): Promise<void>

// IRelaunchHandler implementation
handleRelaunch(options?: IRelaunchOptions): boolean
```

### Cache Path Structure

```
${TEMP}/Sfcode-${quality}-${target}-${arch}/
├── Sfcode-stable-user-x64.exe    // Update files per version
├── Sfcode-stable-system-x64.exe
├── 1.2.3/
│   └── SFCodeSetup-stable-1.2.3.exe
├── 1.2.4/
│   ├── SFCodeSetup-stable-1.2.4.exe
│   └── 1.2.4.flag                   // Marks pending update
├── session-ending.flag               // Session safety
├── cancel.flag                       // Abort signal
├── update-progress                   // Progress tracking
└── updating_version                  // Version being installed
```

---

## Configuration Interface (via IConfigurationService)

```typescript
// These settings control update behavior
{
  // Core update settings
  "update.mode": "default" | "manual" | "start" | "none"
    // default: Auto-check every hour, download in background
    // manual:  User must explicitly check
    // start:   Check only at startup
    // none:    Disabled
  
  // Windows-specific settings
  "update.enableWindowsBackgroundUpdates": boolean
    // true:  Auto-install after download (no restart prompt)
    // false: Download only, user must restart to install
  
  "update.channel": string
    // "stable", "insiders", etc.
}
```

---

## Product Service Interface (IProductService)

```typescript
interface IProductService {
  readonly version: string;              // "1.2.3"
  readonly commit: string;               // "abc123def456..."
  readonly quality: string;              // "stable", "insiders"
  readonly target: string;               // "user" or "system"
  readonly updateUrl: string;            // Server endpoint
  readonly win32VersionedUpdate: boolean; // Use versioned cache
}
```

---

## Request/Response Flow

### Check for Updates

```
REQUEST:
────────
GET /api/update/win32/stable/abc123def456
User-Agent: Code/1.2.2 Electron/13.1.0 Windows NT 10.0
Cache-Control: no-cache


RESPONSE (No update - 204):
───────────────────────────
HTTP/1.1 204 No Content


RESPONSE (Update available - 200):
──────────────────────────────────
HTTP/1.1 200 OK
Content-Type: application/json

{
  "version": "1.2.3",
  "url": "https://updates.example.com/SFCodeSetup-1.2.3.exe",
  "sha256hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "setupUrl": "https://setup.example.com/1.2.3",
  "isUpdateForSFUsers": true
}
```

---

## Update Flow Sequence Diagram

```
User App                Update Service         Update Server         Installer
  │                          │                       │                    │
  ├─ starts ─────────────────>│                       │                    │
  │                          │                       │                    │
  │                    [30s delay]                    │                    │
  │                          │                       │                    │
  │                          ├─ checkForUpdates()    │                    │
  │                          │───────────────────────>│                    │
  │                          │                       │                    │
  │                          │        HTTP 200 with  │                    │
  │                          │        IUpdate data   │                    │
  │                          │<───────────────────────┤                    │
  │                          │                       │                    │
  │             State: AvailableForDownload          │                    │
  │     [notify UI to show update notification]      │                    │
  │                          │                       │                    │
  │      (user clicks "Download")                    │                    │
  │                          │                       │                    │
  │                          ├─ downloadUpdate()    │                    │
  │                          │───────────────────────>│                    │
  │                          │                       │ [stream .exe]      │
  │             State: Downloading                   │                    │
  │     [progress bar updates]                       │<────────────────────┤
  │                          │                       │                    │
  │                          ├─ verify SHA256        │                    │
  │                          │                       │                    │
  │             State: Downloaded                    │                    │
  │                    [to cache]                    │                    │
  │                          │                       │                    │
  │      (if auto-install enabled)                   │                    │
  │                          │                       │                    │
  │                          ├─ doApplyUpdate()      │                    │
  │                          ├─ spawn installer ─────────────────────────>│
  │             State: Updating                      │        [installing]│
  │                          │                       │                    │
  │      (user prompted to restart)                  │                    │
  │                          │                       │                    │
  │      (user clicks "Restart")                     │                    │
  │                          │                       │                    │
  │                          ├─ quitAndInstall()     │                    │
  │                          │                       │                    │
  │                    [app exits]                   │                    │
  │<─────────────────────────┤                       │                    │
  │                          │                       │                    │
  │                          │                       │      [finishes]    │
  │                          │                       │                    │
  │    [relaunches new version]                      │                    │
  │                    [done]                        │                    │
```

---

## Error Handling

### Common Error Scenarios

```typescript
// Network error - no internet
State.Idle(UpdateType.Setup, "Network error: Connection refused")

// Invalid update server response
State.Idle(UpdateType.Setup, "Invalid response from update server")

// SHA256 checksum mismatch - corrupted download
State.Idle(UpdateType.Setup, "Checksum verification failed")

// Installer failed to start
State.Idle(UpdateType.Setup, "Failed to start installer")

// User cancelled installation
State.Idle(UpdateType.Setup)  // No error, just goes back to Idle

// Metered connection - auto-skip on slow/paid networks
// Downloads only happen on explicit user request
```

---

## Event System

```typescript
// Listen for state changes
const subscription = updateService.onStateChange((newState: State) => {
  switch (newState.type) {
    case StateType.CheckingForUpdates:
      console.log("Checking for updates...");
      break;
      
    case StateType.AvailableForDownload:
      console.log(`Update ${newState.update.version} available`);
      break;
      
    case StateType.Downloading:
      console.log(`Downloading: ${newState.downloadedBytes}/${newState.totalBytes}`);
      break;
      
    case StateType.Downloaded:
      console.log("Update downloaded, ready to install");
      break;
      
    case StateType.Updating:
      console.log("Installing update...");
      break;
      
    case StateType.Ready:
      console.log("Update ready to apply on restart");
      break;
      
    case StateType.Idle:
      if (newState.error) {
        console.error(`Update failed: ${newState.error}`);
      }
      break;
  }
});
```

---

## Configuration Examples

### Example 1: Auto-Update Everything
```json
{
  "update.mode": "default",
  "update.enableWindowsBackgroundUpdates": true
}
// Result: Updates check every hour, download + install silently
```

### Example 2: Manual Updates Only
```json
{
  "update.mode": "manual"
}
// Result: User must click "Check for Updates" button
```

### Example 3: Startup Check Only
```json
{
  "update.mode": "start",
  "update.enableWindowsBackgroundUpdates": false
}
// Result: Check at startup, notify user, download only on request
```

### Example 4: Disabled
```json
{
  "update.mode": "none"
}
// Result: No updates at all
```

---

## Testing the Update System

```typescript
// Manually trigger update check
await updateService.checkForUpdates(true);  // explicit=true shows errors

// Download the found update
await updateService.downloadUpdate(true);

// Install and restart
await updateService.applyUpdate();
await updateService.quitAndInstall();

// Monitor progress
updateService.onStateChange.event((state) => {
  console.log(`State: ${state.type}`);
});
```

---

## Quick Reference: Method Call Sequence

```
Normal Flow (Auto-Update Enabled):
──────────────────────────────────
1. initialize()
   ├─ Validate config
   └─ Schedule recurring checks

2. checkForUpdates(false) [auto]
   ├─ HTTP GET to server
   ├─ Parse response
   └─ setState(AvailableForDownload)

3. downloadUpdate(false) [auto, if enabled]
   ├─ HTTP stream .exe
   ├─ Verify checksum
   └─ setState(Downloaded)

4. doApplyUpdate() [auto or user-triggered]
   ├─ spawn installer process
   └─ setState(Updating)

5. User restarts app
   └─ Installer finishes
      └─ App launches with new version


User-Triggered Flow (Manual Mode):
──────────────────────────────────
1. User clicks "Check for Updates"
   └─ checkForUpdates(true)  // explicit=true

2. User clicks "Download"
   └─ downloadUpdate(true)   // explicit=true

3. User clicks "Install & Restart"
   └─ quitAndInstall()       // Triggers installation
```

---

## File Paths Reference

```
Update Server Base:
  ${productService.updateUrl}
  Example: https://updates.company.com

Update Check Endpoint:
  ${updateUrl}/api/update/${platform}/${quality}/${commit}
  Example: https://updates.company.com/api/update/win32/stable/abc123

Cache Directory:
  ${TEMP}/Sfcode-${quality}-${target}-${arch}
  Example: C:\Users\User\AppData\Local\Temp\Sfcode-stable-user-x64

Downloaded Update:
  ${cachePath}/SFCodeSetup-${quality}-${version}.exe
  Example: C:\...\Sfcode-stable-user-x64\SFCodeSetup-stable-1.2.3.exe

Version Cache:
  ${cachePath}/${version}/
  Example: C:\...\Sfcode-stable-user-x64\1.2.3\
```

---

## Summary Table

| Component | Purpose | Platform |
|-----------|---------|----------|
| `IUpdateService` | Main interface contract | All |
| `AbstractUpdateService` | Base implementation, state machine | All |
| `Win32UpdateService` | Windows-specific impl, Inno Setup integration | Windows |
| `ISyncfusionUpdate` | Extended update data with setup URL | All |
| `State` | Current update status | All |
| `IAvailableUpdate` | Downloaded .exe metadata | Windows |
| `updateService.win32.ts` | Windows service (1051 lines) | Windows |
| `abstractUpdateService.ts` | Base service (578 lines) | All |

