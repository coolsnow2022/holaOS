# App Anatomy

This page explains how a workspace app is structured in practice: UI, local state, MCP tools, background services, manifest, integrations, and outputs.

If you want the system-level explanation of why apps exist in `holaOS`, read [Apps in holaOS](/holaos/apps) first.

## The main pieces

<DocDefinition term="Web app" meta="TanStack Start">
The operator-facing UI and route handlers. This is where you render the app, expose pages, and surface local records.
</DocDefinition>

<DocDefinition term="Services process" meta="MCP + jobs">
The background process that starts the MCP server and any queue workers or sync jobs.
</DocDefinition>

<DocDefinition term="Local database" meta="SQLite">
The app's durable local state. Most workspace apps keep drafts, records, queue state, and sync metadata here.
</DocDefinition>

<DocDefinition term="Bridge SDK" meta="App-local helper">
The helper that brokers provider calls and writes workspace outputs when the app is installed in a Holaboss workspace.
</DocDefinition>

<DocDefinition term="Integration requirements" meta="declared in app.runtime.yaml">
The external services an app needs access to. Each requirement names a provider (e.g. Google, GitHub), the specific capability needed (e.g. Gmail), and the OAuth scopes required. The runtime resolves these by binding connected accounts to the app and proxying credentials through the broker — the app never sees raw tokens.
</DocDefinition>

<DocDefinition term="Runtime manifest" meta="app.runtime.yaml">
The file the workspace runtime reads to install, start, health-check, stop the app, and resolve its integration requirements.
</DocDefinition>

## Typical directory layout

```text
<workspace-root>/
  apps/
    <app-id>/
      app.runtime.yaml
      package.json
      src/
        routes/
        server/
          mcp.ts
          holaboss-bridge.ts
          start-services.ts
          actions.ts
          db.ts
          queue.ts
          publisher.ts
      test/
```

The source template for an app may live elsewhere while you are developing it, but the runtime contract begins at the workspace-local package under `apps/<app-id>/`.

### `src/routes/`

The web UI lives here. The template already includes a basic index route and record detail routes so each app can present its data in a browser.

### `src/server/mcp.ts`

This is the main agent interface. It defines the MCP tools that the workspace agent can call.

### `src/server/start-services.ts`

This bootstraps the services process. In the workspace apps that already ship in the repo, it usually starts the MCP server and any background workers together.

### `src/server/holaboss-bridge.ts`

This is where the app integrates with the Holaboss broker and workspace output APIs.

### `app.runtime.yaml`

This tells the runtime how to treat the app during installation and execution.

## Process model

Most workspace apps run as two cooperating processes:

1. The web app serves the UI and route handlers.
2. The services process serves MCP and job execution.

That split keeps the UI responsive while the app still supports agent-driven work.

## State boundaries

Use the following split by default:

- SQLite for local app records and queue state
- Workspace outputs for items that should surface in the Holaboss workspace
- Bridge SDK calls for external integration access
- Route handlers for the operator UI

## What not to do

- Do not depend on a shared internal app package unless the repo already requires it.
- Do not hide tool behavior only in UI code.
- Do not keep runtime-critical state only in memory.
- Do not assume the web process can replace the MCP process.
