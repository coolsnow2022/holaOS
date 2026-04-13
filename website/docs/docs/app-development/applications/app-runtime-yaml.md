# `app.runtime.yaml`

`app.runtime.yaml` is the runtime contract for a workspace app. The workspace runtime reads it to know how to install the app, start it, health-check it, expose its MCP surface, and resolve its integration requirements.

## Minimal shape

```yaml
app_id: "twitter-module"
name: "Twitter/X"
slug: "twitter"

lifecycle:
  setup: "rm -rf node_modules && npm install --maxsockets 1 && npm run build"
  start: "DB_PATH=./data/module.db nohup npm run start > /tmp/twitter-module.log 2>&1 & DB_PATH=./data/module.db nohup npx tsx src/server/start-services.ts > /tmp/twitter-services.log 2>&1 &"
  stop: "kill $(lsof -t -i :${PORT:-3000} 2>/dev/null) 2>/dev/null || true; kill $(lsof -t -i :${MCP_PORT:-3099} 2>/dev/null) 2>/dev/null || true"

healthchecks:
  mcp:
    path: /mcp/health
    timeout_s: 30

mcp:
  enabled: true
  transport: http-sse
  port: 3099
  path: /mcp/sse
  tools:
    - post_tweet
    - list_mentions

integrations:
  - key: primary_twitter
    provider: twitter
    capability: twitter
    scopes:
      - tweet.read
      - tweet.write
    required: true
    credential_source: platform
    holaboss_user_id_required: true

env_contract:
  - "HOLABOSS_USER_ID"
  - "HOLABOSS_APP_GRANT"
  - "HOLABOSS_INTEGRATION_BROKER_URL"
  - "WORKSPACE_API_URL"
```

## Field guide

| Field | Purpose |
| --- | --- |
| `app_id` | Stable internal identifier for the app |
| `name` | Human-readable app name |
| `slug` | Short runtime slug used for routing and installation |
| `lifecycle.setup` | Command that installs dependencies and builds the app |
| `lifecycle.start` | Command that starts the web app and services process |
| `lifecycle.stop` | Cleanup command for both runtime ports |
| `healthchecks.mcp.path` | Endpoint the runtime uses to confirm the MCP server is alive |
| `mcp.enabled` | Whether the runtime should expose MCP for the app |
| `mcp.transport` | Transport type, typically `http-sse` in the current shipped apps |
| `mcp.port` | Default MCP port used by the app entrypoint |
| `mcp.path` | Path served by the MCP server, for example `/mcp` or `/mcp/sse` |
| `mcp.tools` | Optional tool ids the runtime records in the MCP registry for this app |
| `env_contract` | Environment variables the runtime should provide |

## Integrations

The `integrations` field declares which external services the app needs. This is a list — an app can require multiple providers.

| Field | Purpose |
| --- | --- |
| `key` | Unique identifier for this requirement within the app (e.g. `primary_google`) |
| `provider` | External provider name (`google`, `github`, `twitter`, `reddit`, etc.) |
| `capability` | Specific capability needed from the provider (e.g. `gmail` from `google`) |
| `scopes` | OAuth scopes or permissions the app needs |
| `required` | Whether the app can function without this integration |
| `credential_source` | Where credentials come from — `platform`, `manual`, or `broker` |
| `holaboss_user_id_required` | Whether the app needs the active Holaboss user id |

### How integration resolution works

Apps do not receive raw credentials. Instead:

1. The app declares its requirements in `integrations`.
2. The user connects their external account (e.g. Google OAuth) — this creates a **connection** in the runtime state store.
3. The workspace binds that connection to the app through a **binding** — either app-specific or a workspace-wide default.
4. At app start, the runtime injects `HOLABOSS_APP_GRANT` and `HOLABOSS_INTEGRATION_BROKER_URL` into the app environment.
5. The app uses the [Bridge SDK](/app-development/bridge-sdk) to call external APIs through the broker, which exchanges the grant for a real provider token on each request.

```text
App (needs Gmail access)
  → declares: integrations: [{ provider: google, capability: gmail }]
  → receives: HOLABOSS_APP_GRANT + HOLABOSS_INTEGRATION_BROKER_URL
  → calls: Bridge SDK → broker proxy → Gmail API
```

This keeps secrets out of the app process and workspace files.

### Legacy single-integration format

Older apps may use a single `integration` field instead of the `integrations` list. The runtime supports both, but new apps should use the list format.

```yaml
# Legacy — still supported
integration:
  destination: "twitter"
  credential_source: "platform"
  holaboss_user_id_required: true
```

## Practical guidance

### Keep lifecycle commands idempotent

The runtime may reinstall or restart an app more than once. Prefer commands that can be re-run safely.

### Align the MCP path with the server

If your MCP server listens on `/mcp/sse`, make sure the manifest and the server code agree. If they diverge, health checks and tool connections become hard to diagnose.

### Use single-threaded installs when needed

Some workspace apps install inside constrained overlay filesystems. The repository's shipped apps often use `npm install --maxsockets 1` to keep installs predictable.

### Do not assume the default port is permanent

The runtime can override ports when the app is installed into a workspace. Treat the manifest port as a default, not as a hard guarantee.

If you want manifest-level MCP tool metadata, declare those tool ids under `mcp.tools`. A top-level `tools` key is not part of the current runtime manifest contract.
