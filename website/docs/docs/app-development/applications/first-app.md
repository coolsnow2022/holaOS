# Build Your First App

The fastest way to create a workspace app is to start from an app template and materialize it into the workspace-local `apps/<app-id>/` directory, then replace the placeholder values with your own app identity, routes, tools, and runtime config.

<DiagramStepFlow :steps="[
  { label: 'Copy', detail: '_template' },
  { label: 'Identity', detail: 'Rename app' },
  { label: 'Tool', detail: 'One MCP tool' },
  { label: 'Manifest', detail: 'app.runtime.yaml' },
  { label: 'Bridge', detail: 'SDK if needed' },
  { label: 'Verify', detail: 'UI + MCP + health' },
]" />

The first success criterion is a complete runtime loop inside a workspace, not a large feature set.

This template already gives you the core pieces:

- TanStack Start web app
- MCP server
- SQLite-backed local state
- `app.runtime.yaml`
- Bridge SDK (`@holaboss/bridge` via npm)

## 1. Materialize the app into the workspace

Start from the app template you are using and place the new app under the workspace's `apps/<app-id>/` directory.

The installed app package should keep the same internal shape:

- `src/routes/` for the UI
- `src/server/mcp.ts` for MCP tools
- `src/server/holaboss-bridge.ts` for integrations and workspace outputs
- `src/server/start-services.ts` for the background service entrypoint
- `app.runtime.yaml` for runtime lifecycle and health checks

The important contract for Holaboss is not where the template originally lived in a source repo. It is the workspace-local package that ends up under `apps/<app-id>/`.

## 2. Replace the placeholder identity

Update the app metadata so the installed app no longer looks like a template.

Typical values to rename:

- `app_id`
- `name`
- `slug`
- MCP server name
- log file names
- queue/job labels

::: warning
Keep the app name stable across the runtime manifest, the MCP tool names, and any output metadata. A mismatch makes debugging much harder once the app is installed into workspaces.
:::

## 3. Define one real tool first

Do not start with five tools. Start with one useful workflow and make it reliable.

<DocSteps>
  <DocStep title="Choose the action">
    Pick a single action that the agent should be able to perform, such as creating a draft, listing records, or publishing a queued item.
  </DocStep>
  <DocStep title="Add the MCP tool">
    Implement the tool in `src/server/mcp.ts` with an app-specific name like `twitter_create_post` instead of the placeholder `module_create_post`.
  </DocStep>
  <DocStep title="Persist state">
    Store the result in the app's local database so the tool can be queried later.
  </DocStep>
  <DocStep title="Return machine-readable text">
    Return JSON in a text payload so the agent can inspect the result without guessing at formatting.
  </DocStep>
</DocSteps>

## 4. Add the runtime manifest

Use `app.runtime.yaml` to tell the workspace runtime how to manage the app.

At minimum, define:

- `lifecycle.setup`
- `lifecycle.start`
- `lifecycle.stop`
- `healthchecks.mcp.path`
- `mcp.enabled`
- `mcp.transport`
- `mcp.path`
- `integrations` — declare which external services the app needs (provider, capability, scopes, required). The runtime resolves these to connected accounts and injects credentials through the broker. See [app.runtime.yaml](/app-development/applications/app-runtime-yaml#integrations) for the full format.
- `env_contract`

## 5. Wire the Bridge SDK only when needed

Not every workspace app needs to talk to an external integration or publish outputs.

Use the Bridge SDK when the app needs to:

- Call a brokered provider integration
- Create or update workspace outputs
- Attach app resource presentations to workspace content

## 6. Verify the app end to end

Before you add more features, make sure these checks pass:

- The web app starts
- The service process starts
- `/mcp/health` returns `ok`
- The first tool returns a sensible result
- The runtime can install and start the app from the manifest

## A good first milestone

The first version of a useful workspace app should let a developer:

- open the UI
- call one MCP tool
- inspect the stored record
- publish or update one workspace output if the app needs that behavior

That is enough to prove the app fits the Holaboss workspace runtime model.
