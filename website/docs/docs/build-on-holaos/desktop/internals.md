# Desktop Internals

Use this page when you are expanding the desktop shell itself rather than only adjusting workspace content or runtime configuration.

## Main code seams

- `desktop/src/components/layout/AppShell.tsx`: the main shell composition. This is where the agent pane, file explorer pane, browser panes, central display, inbox/proactive operations, marketplace/publish flows, and notification flow are coordinated.
- `desktop/src/components/panes/BrowserPane.tsx`, `SpaceBrowserExplorerPane.tsx`, and `SpaceBrowserDisplayPane.tsx`: browser UI surfaces, including the `user` and `agent` browser spaces.
- `desktop/src/components/panes/FileExplorerPane.tsx`: workspace file explorer, previews, editing, bookmarking, and file-watch behavior.
- `desktop/src/components/layout/NotificationToastStack.tsx`: desktop notification presentation and activation behavior.
- `desktop/electron/preload.ts`: the renderer-to-main bridge exposed as `window.electronAPI`.
- `desktop/src/types/electron.d.ts`: the typed contract for that bridge. This is the best single place to inspect what the renderer is allowed to call.
- `desktop/electron/main.ts`: the main-process implementation for the IPC contract, BrowserView orchestration, runtime config, workspace actions, file system actions, and browser state.

## Renderer-to-main contract

The desktop renderer does not talk to Electron internals directly. It goes through namespaced bridge contracts exposed by `electronAPI`.

Important namespaces include:

- `fs`: directory listing, previews, writes, file watches, and bookmarks
- `browser`: browser workspace selection, tab state, navigation, history, downloads, suggestions, and bounds syncing
- `workspace`: workspace lifecycle, sessions, apps, outputs, cronjobs, notifications, memory proposals, integrations, and packaging flows
- `runtime`: runtime status, runtime config, profile, binding exchange, and restart flows
- `auth`: desktop sign-in and runtime binding exchange
- `billing`: subscription and usage surfaces
- `diagnostics`: local runtime and environment inspection helpers
- `appUpdate`: desktop update state and install flow
- `appSurface`: embedded app-surface navigation and bounds control
- `ui`: theme, settings routing, and external-link helpers
- `workbench`: browser-opening handoff from workbench surfaces into the main shell

If you change the desktop contract, update both `desktop/electron/preload.ts` and `desktop/src/types/electron.d.ts`.

## Browser protocol

The browser system is not just a webview dropped into React. The current path uses BrowserView orchestration in the main process and synchronizes the visible viewport from the renderer using `browser.setBounds`.

Important behavior to understand:

- browser state is workspace-aware
- browser spaces are explicit: `user` and `agent`
- the renderer activates tabs and navigation through `electronAPI.browser`
- the main process owns actual BrowserView attachment, persistence, downloads, history, and popup windows

This split is why browser behavior belongs to desktop internals, not to generic UI code alone.

## File explorer contract

The file explorer goes through the `fs:*` IPC namespace rather than reading files directly from the renderer.

The current contract includes:

- `fs:listDirectory`
- `fs:readFilePreview`
- `fs:writeTextFile`
- `fs:writeTableFile`
- `fs:watchFile`
- `fs:createPath`
- `fs:renamePath`
- `fs:movePath`
- `fs:deletePath`
- bookmark and file-change events

That keeps file access centralized in the main process and makes workspace-relative behavior auditable.

## Notification contract

Desktop notifications are runtime-backed, not purely renderer-local.

The current path is:

1. runtime persists notification records in `runtime/state-store`
2. runtime exposes them through `/api/v1/notifications`
3. Electron routes that through `workspace:listNotifications` and `workspace:updateNotification`
4. `AppShell` polls and hydrates the toast stack
5. `NotificationToastStack` renders activation and dismissal behavior

So if you are changing notification behavior, inspect both the desktop shell and the runtime notification model.

## Display-surface model

The shell maintains a central display surface that can project:

- browser content
- app content
- internal surfaces

That routing currently lives in `AppShell.tsx` through `spaceDisplayView`. If you are adding a new display mode, start there and trace the corresponding pane/component path.

## Development guidance

When changing desktop internals:

- keep renderer/main boundaries explicit
- change typed bridge contracts together with their IPC implementations
- be careful with BrowserView lifecycle and bounds syncing
- preserve workspace-aware routing instead of introducing global singleton UI state
- treat runtime-backed notifications, sessions, and outputs as product state, not as ad hoc local UI caches
