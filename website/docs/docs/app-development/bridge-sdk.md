# Holaboss Bridge SDK

The Bridge SDK (`@holaboss/bridge`) connects workspace apps to the Holaboss runtime and workspace services. It will be published to npm:

::: code-group

```sh [npm]
npm install @holaboss/bridge
```

```sh [pnpm]
pnpm add @holaboss/bridge
```

```sh [yarn]
yarn add @holaboss/bridge
```

```sh [bun]
bun add @holaboss/bridge
```

:::

It handles two jobs:

1. **Integration proxy** — calling external services (Gmail, GitHub, Twitter, etc.) through the Holaboss broker. Apps declare integration requirements in `app.runtime.yaml`; the broker resolves the connected account and injects credentials per request. The app never handles raw tokens.
2. **Workspace outputs** — writing durable results back into the active workspace when the app is running inside Holaboss.

## Core environment variables

| Variable | Meaning |
| --- | --- |
| `HOLABOSS_APP_GRANT` | App grant used to authorize brokered integration calls |
| `HOLABOSS_WORKSPACE_ID` | Active workspace id used when writing outputs |
| `HOLABOSS_INTEGRATION_BROKER_URL` | Explicit broker URL when the runtime already knows it |
| `SANDBOX_RUNTIME_API_PORT` | Preferred runtime API port in managed runtime execution |
| `SANDBOX_AGENT_BIND_PORT` | Alternate port used when the runtime injects the agent bind port |
| `WORKSPACE_API_URL` | Base workspace API URL for output persistence |
| `PORT` | Fallback port when the app is running locally |

## What the bridge exposes

### `createIntegrationClient(provider)`

Creates a proxy client for a named provider.

Use it when the app needs to call an integration through the Holaboss broker instead of talking to the provider directly.

### `proxy(request)`

Sends a request through the broker with a method, endpoint, and optional body.

The bridge handles:

- the grant token
- the provider name
- the broker request envelope
- basic non-OK response handling

### `buildAppResourcePresentation({ view, path })`

Builds the presentation object used for app resources.

Use it when you want the workspace UI to open a resource in a predictable view and path.

### `createAppOutput(request)`

Creates a workspace output record if the app is running inside a Holaboss workspace.

It returns `null` when output publishing is not available, so callers should guard for that case.

### `updateAppOutput(outputId, request)`

Updates an existing workspace output record.

Use this for status transitions and metadata refreshes after the initial create.

## When publishing is available

The bridge only publishes outputs when it can resolve both:

- the workspace API URL
- the active workspace id

If either piece is missing, the helper returns `null` instead of throwing during normal local development.

## Proxy flow

```text
workspace app
  -> @holaboss/bridge
  -> integration broker proxy
  -> provider integration
```

## Output flow

```text
workspace app
  -> createAppOutput()
  -> workspace outputs API
  -> optional updateAppOutput()
```

For chat-visible app results tied to an assistant turn, use session artifact publishing instead:

```text
workspace app MCP tool
  -> publishSessionArtifact()
  -> session artifacts API
  -> chat artifact chip + app routing
```

## Practical usage pattern

1. Build local app state first.
2. Create or update the workspace output when the record is ready.
3. Keep the output metadata aligned with the app record id.
4. Update status after the real-world action completes.

## Notes from the current implementation

- `createAppOutput()` writes `workspace_id`, `output_type`, `title`, `module_id`, `module_resource_id`, `platform`, and `metadata`.
- `publishSessionArtifact()` is the preferred path for draft/tool results that should appear under the current assistant response in chat.
- If a non-draft status is requested at creation time, the helper immediately performs an update after the create.
- `updateAppOutput()` accepts partial fields so callers can patch only the values that changed.
- The helper normalizes resource paths to start with `/` before building app resource presentations.
