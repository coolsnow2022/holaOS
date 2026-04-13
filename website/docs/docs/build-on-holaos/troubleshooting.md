# Troubleshooting

This page collects the most common issues that show up when starting Holaboss locally or packaging the runtime bundle.

If you hit something that is not covered here, we always welcome issues. Real setup failures, unclear docs, and runtime edge cases are all useful signals for improving `holaOS` and Holaboss Desktop.

## The desktop app does not start

Most desktop startup issues come from the local environment rather than from the app itself.

- verify that Node.js 22+ is installed
- run `npm run desktop:install` again
- make sure `desktop/.env` exists and contains the expected values
- rebuild the runtime bundle with `npm run desktop:prepare-runtime:local`

## The runtime health check fails

If `http://127.0.0.1:8080/healthz` does not respond:

- confirm that the runtime process is actually running
- confirm that `SANDBOX_AGENT_BIND_HOST` and `SANDBOX_AGENT_BIND_PORT` are set correctly
- check for a port conflict on `8080`
- look at the runtime logs for a startup error

```bash
curl http://127.0.0.1:8080/healthz
```

## The runtime bundle is stale

If the desktop app is using an older runtime bundle than the one you expect:

- rerun `npm run desktop:prepare-runtime:local`
- delete the staged runtime bundle and rebuild it
- verify that the desktop app is pointing at the bundle you just staged

## Model configuration looks correct but requests still fail

Check the provider path first:

- verify that the provider base URL is reachable
- verify that the auth token is valid
- verify that the selected model name matches the provider contract
- verify that `runtime-config.json` is being read from the expected path

## App setup fails inside an isolated app environment or container

This usually means the install step is colliding with overlay filesystem behavior.

Use the same pattern the app templates recommend:

```bash
rm -rf node_modules && npm install --maxsockets 1 && npm run build
```

Also verify that the app manifest uses the expected MCP path and startup command.

## The runtime starts but workspace data looks wrong

Check these files first:

- `workspace.yaml`
- `AGENTS.md`
- `apps/<app-id>/app.runtime.yaml`
- `.holaboss/`
- `state/runtime.db`

If the workspace files are valid but the runtime still behaves unexpectedly, compare the current bundle against the source revision you used to stage it.

## Report an issue

If none of the fixes on this page help, submit an issue here:

- [Open a GitHub issue](https://github.com/holaboss-ai/holaboss-ai/issues/new/choose)
