# Runtime APIs

The runtime exposes HTTP APIs for workspace management, runtime configuration, execution, memory, integrations, outputs, notifications, and app lifecycle control.

These APIs are used by the desktop app and by surrounding platform services. They are not intended to be a generic public developer platform; they are the operational surface that keeps a workspace running.

## Common endpoint families

| Area | Typical endpoints | Purpose |
| --- | --- | --- |
| Runtime config and health | `/api/v1/runtime/config`, `/api/v1/runtime/status`, `/api/v1/runtime/system-status` | Read and update runtime settings and health state |
| Runtime profile | `/api/v1/runtime/profile` | Read and update runtime-owned operator profile state |
| Workspaces | `/api/v1/workspaces` | Create, list, update, delete, snapshot, export, and materialize workspaces |
| Files | `/api/v1/workspaces/:workspaceId/files/*` | Read and write workspace files |
| Agent runs | `/api/v1/agent-runs`, `/api/v1/agent-runs/stream` | Start a run and stream events |
| Agent sessions and artifacts | `/api/v1/agent-sessions`, `/api/v1/agent-sessions/:id/*` | Create sessions, inspect history, and trace resume state |
| Browser capability | `/api/v1/capabilities/browser`, `/api/v1/capabilities/browser/tools/:toolId` | Inspect browser availability and execute browser tools |
| Memory | `/api/v1/memory/search`, `/api/v1/memory/get`, `/api/v1/memory/upsert` | Query and update runtime memory surfaces |
| Integrations | `/api/v1/integrations/*` | Catalog providers, connections, and bindings |
| App control | `/api/v1/apps/:appId/start`, `/stop`, `/setup`, `/build-status`, `/ensure-running` | Manage app lifecycle |
| App ports | `/api/v1/apps/ports` | Resolve the ports assigned to installed apps |
| Outputs and folders | `/api/v1/outputs`, `/api/v1/output-folders` | Create, list, organize, and update outputs |
| Notifications | `/api/v1/notifications` | Read and update runtime-backed notifications |
| Internal orchestration | `/api/v1/internal/workspaces/:workspaceId/resolved-apps/start` | Start all resolved apps for a workspace |

## Runtime config and profile

Use the runtime endpoints when you need to:

- inspect the current model/provider setup
- verify the runtime is healthy
- update runtime-level settings
- read or update the runtime-owned operator profile

## Workspace APIs

The workspace endpoints manage the durable workspace shape:

- create a workspace
- list available workspaces
- fetch a workspace by id
- update workspace metadata
- delete a workspace
- apply a template
- clone a template from a URL
- read and write workspace files
- export or snapshot a workspace

This is the main API family behind workspace materialization, onboarding-aware workspace creation, and workspace editing flows.

## Execution and sessions

The execution surface is broader than just starting a run:

- `POST /api/v1/agent-runs` starts a run
- `POST /api/v1/agent-runs/stream` starts a run and streams events back
- `POST /api/v1/agent-sessions` creates a session
- session/history/artifact endpoints expose the state used to inspect and resume work later

These endpoints are what the runtime uses when it needs turn-level execution, session continuity, and event streaming.

## Capability and environment APIs

Several endpoint families exist because the runtime owns more than turn execution:

- browser capability endpoints expose the current desktop-browser surface
- memory endpoints expose durable and runtime-owned memory operations
- integration endpoints expose provider catalogs, connected accounts, and binding flows
- outputs and notifications expose reviewable product state that the desktop renders directly

## App lifecycle

Apps are controlled through lifecycle endpoints such as:

- start
- stop
- setup
- ensure-running
- build-status

App lifecycle is driven by the app manifest. The runtime reads `app.runtime.yaml`, resolves the declared commands, and then starts or stops the app accordingly.

For public documentation, the key idea is simple: the runtime only needs the manifest contract. It does not care what implementation framework the app uses internally.

## Practical takeaway

If you are building against the runtime, think in these operational slices:

1. workspace and file APIs for durable authored state
2. execution and session APIs for run lifecycle
3. memory, integration, output, and notification APIs for runtime-owned system state
4. app lifecycle APIs for app-specific behavior
