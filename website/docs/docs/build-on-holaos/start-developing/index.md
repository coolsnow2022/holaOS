# Start Developing

This is the recommended local path for `holaOS` development: install the desktop app, stage the runtime bundle, and start the desktop dev loop.

<DiagramLocalStack />

For local development, think in three layers: desktop operator UI, a runtime bundle that includes the harness boundary, and workspace apps loaded by that runtime.

## Start with Quick Start

For the baseline local desktop setup, follow [Quick Start / Manual Install](/getting-started/#manual-install) first.

That page is the canonical path for:

- cloning the repository
- installing desktop dependencies
- creating `desktop/.env`
- running the desktop typecheck
- launching `npm run desktop:dev`

Once that flow is working, use this page for runtime-specific verification and deployment-oriented local checks.

If you want to stage the local runtime bundle explicitly before launching the desktop app, run:

```bash
npm run desktop:prepare-runtime:local
```

`npm run desktop:dev` already performs the checks needed to keep the local runtime bundle fresh. If the staged bundle is missing or stale, it will prepare one for you automatically, so the explicit `desktop:prepare-runtime:local` step is optional.

## Runtime-only verification

If you want to work on the runtime without opening the desktop app, build and test the runtime packages directly:

```bash
npm run runtime:state-store:install
npm run runtime:state-store:build
npm run runtime:harness-host:install
npm run runtime:harness-host:build
npm run runtime:api-server:install
npm run runtime:test
```

## Useful checks

- confirm that the runtime health endpoint responds at `http://127.0.0.1:8080/healthz`
- confirm that the OS root is writable
- confirm that your provider configuration matches the model provider you plan to use

## When to use this page

Use this flow when you want to:

- validate desktop changes
- test runtime packaging changes
- verify model configuration
- reproduce a runtime bug locally before touching production infrastructure

::: warning
The local flow assumes Node.js 22+ and a working desktop toolchain. If Electron cannot start on your machine, validate the runtime bundle first and fix the platform issue before debugging app logic.
:::

## Next

If you are expanding the desktop shell itself, continue to [Desktop Internals](/build-on-holaos/desktop/internals). If you are expanding the executor boundary, continue to [Agent Harness Internals](/build-on-holaos/agent-harness/internals). For the contributor workflow, validation expectations, and review guidance, continue to [Contributing](/build-on-holaos/start-developing/contributing).
