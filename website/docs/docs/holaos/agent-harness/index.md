# Harness Overview

The agent harness is the executor the runtime uses for a run. In `holaOS`, the harness is a subsystem inside the runtime boundary, not the whole system. The runtime still owns the environment contract around it: workspace structure, memory and continuity, capability projection, app orchestration, and the reduced execution package passed into the harness.

## Where it sits

1. The workspace holds authored inputs such as `workspace.yaml`, `AGENTS.md`, installed app manifests, and skills.
2. The runtime compiles that into per-run state: prompt layers, selected model configuration, recalled memory, MCP tool visibility, attachments, and a workspace checksum.
3. The harness host invokes the selected agent harness.
4. The harness executes the run and emits normalized lifecycle events back into the runtime path.

The harness sits inside the runtime execution boundary. It does not sit beside the workspace, and it does not replace the runtime.

## Why the harness is interchangeable

`holaOS` does not hard-code one harness as the whole system contract. Instead, the runtime defines a stable boundary around the harness so different executors can fit into the same environment model.

That means the harness can, in principle, be swapped for other agent runtimes such as:

- OpenCode
- Codex
- Claude Code
- Hermes Agent
- OpenClaw
- another future harness that can satisfy the same contract

The important point is not the specific harness brand. The important point is that the workspace model, memory behavior, continuity state, and capability projection do not have to be redefined every time the executor changes.

## What the runtime contract passes in

Today the runtime prepares a harness request that includes:

- workspace, session, and input identity
- the current instruction and staged input attachments
- selected provider and model client configuration
- the composed system prompt and runtime context messages
- workspace skill directories
- resolved MCP servers and allowlisted MCP tool refs
- browser capability state for workspace sessions
- a workspace configuration checksum and run lifecycle metadata

The harness receives a reduced execution package, not the whole raw system.

## Attachment handling

The current host does more than pass attachment file paths through blindly. It stages and interprets the attachment surface before the executor sees it:

- text-like files can be inlined directly
- PDFs, DOCX, PPTX, spreadsheets, and images are normalized through the host attachment path
- when inline extraction is not possible, staged attachment files still remain available in the workspace input batch

That is part of the runtime-to-host boundary, not an ad hoc executor detail.

## Current shipped path

Today the OSS repo ships one harness path: `pi`.

That path is currently split into:

- a runtime adapter in `runtime/harnesses/src/pi.ts`
- a harness host plugin in `runtime/harness-host/src/pi.ts`
- a Pi-based executor underneath that path

In practical terms, the currently shipped harness is the `pi` path, implemented by the `pi` runtime adapter and `pi` host plugin. The design choice that matters is that the runtime boundary around it is intentionally broader than the executor package underneath it.

## What stays stable even if the harness changes

- the workspace contract
- runtime-owned memory and continuity
- MCP and capability projection per run
- app lifecycle and integration resolution
- the desktop as a product surface above the environment

Changing the harness should change the executor, not the definition of `holaOS`.

## Read next

<DocCards>
  <DocCard
    title="Adapter Capabilities"
    eyebrow="Current behavior"
    href="/holaos/agent-harness/adapter-capabilities"
    description="Start with the runtime adapter contract, then move through the detailed capability pages."
  />
  <DocCard
    title="Agent Harness Internals"
    eyebrow="Developer path"
    href="/build-on-holaos/agent-harness/internals"
    description="Inspect the code seams that matter if you want to expand or replace the current harness path."
  />
</DocCards>
