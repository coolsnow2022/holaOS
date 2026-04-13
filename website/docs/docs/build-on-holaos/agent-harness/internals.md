# Internals and Contracts

Use this page when you are expanding the harness boundary itself rather than only building apps or templates.

The runtime intentionally splits the harness into a runtime adapter, a runtime plugin, and a harness-host plugin so a new executor can fit into the same `holaOS` environment model without redefining memory, continuity, or the workspace contract.

## Main code seams

- `runtime/harnesses/src/types.ts`: canonical harness contracts, including adapter capabilities, runner prep plans, prompt-layer payloads, prepared MCP payloads, and host request build parameters.
- `runtime/harnesses/src/pi.ts`: the current `pi` runtime adapter. This is where the shipped path declares capabilities, chooses its runner prep plan, and builds the reduced host request.
- `runtime/api-server/src/harness-registry.ts`: runtime-side harness registration. This is where browser tools, runtime tools, skill staging, command staging, readiness, and harness-specific timeouts are coordinated.
- `runtime/api-server/src/ts-runner.ts`: per-run bootstrap. This is where the runtime applies the default tool set, adds extra tools such as `web_search`, prepares browser/runtime/MCP state, and builds the agent runtime config request.
- `runtime/api-server/src/agent-runtime-config.ts`: prompt and capability projection. This is where prompt layers, recalled memory, recent runtime context, capability manifests, and tool visibility are composed before the harness runs.
- `runtime/harness-host/src/contracts.ts`: host-side request and event contracts. This is the source of truth for the decoded host request and the normalized runner event types the host must emit back.
- `runtime/harness-host/src/index.ts`: harness-host CLI entrypoint that dispatches a registered host plugin by command.
- `runtime/harness-host/src/pi.ts`: the current host implementation. This is where the host loads workspace skills, applies skill widening, enforces workspace-boundary policy, injects browser/runtime/web search tools, and materializes allowlisted MCP tools.
- `runtime/harness-host/src/pi-browser-tools.ts`: desktop browser bridge used by the current host.
- `runtime/harness-host/src/pi-runtime-tools.ts`: runtime-managed tool bridge for onboarding, cronjobs, and image generation.
- `runtime/harness-host/src/pi-web-search.ts`: hosted native web search bridge for the current `web_search` tool.
- `runtime/harnesses/src/desktop-browser-tools.ts`, `runtime/harnesses/src/runtime-agent-tools.ts`, and `runtime/harnesses/src/native-web-search-tools.ts`: canonical ids and descriptions for the projected browser, runtime, and native web-search surfaces.

## How to add another harness

1. Add a new runtime adapter under `runtime/harnesses/src/` that declares capabilities and a runner prep plan.
2. Build the host request from the runtime's reduced execution package instead of letting the executor infer state implicitly.
3. Implement a host plugin under `runtime/harness-host/src/` that decodes that request and emits normalized lifecycle events.
4. Register the runtime plugin in `runtime/api-server/src/harness-registry.ts` so browser tools, runtime tools, skill staging, timeouts, and readiness rules match the new harness.
5. Decide deliberately which capability surfaces the harness should expose: browser tools, runtime tools, MCP, skills, native web search, or future additions.
6. Keep event normalization stable so the runtime and desktop can observe runs without depending on harness-native output.

## Invariants to preserve

- The workspace contract stays runtime-owned. A harness should consume it, not redefine it.
- Memory and continuity stay runtime-owned. A harness can use recalled context, but it should not replace the persistence model.
- MCP tools stay allowlisted per run. Do not expose whole servers when the runtime only resolved a subset of tools.
- Skills stay explicit. If a harness supports skill-driven widening, keep the widening rules inspectable and tied to skill metadata.
- The harness should receive a reduced execution package, not uncontrolled access to the whole product state.

## Current implementation notes

Today the shipped path is `pi`, backed by the `pi` adapter and host implementation. The easiest way to understand the current flow is:

1. Start in `runtime/harnesses/src/pi.ts`.
2. Follow registration through `runtime/api-server/src/harness-registry.ts`.
3. Trace run bootstrap in `runtime/api-server/src/ts-runner.ts`.
4. Inspect the actual host implementation in `runtime/harness-host/src/pi.ts`.

That sequence will show you where the stable boundary is, where capability projection happens, and where a future harness would need to plug in.
