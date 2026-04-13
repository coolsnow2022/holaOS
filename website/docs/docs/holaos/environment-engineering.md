# Environment Engineering

This page explains the core technical thesis behind `holaOS`: long-horizon agent systems need environment engineering, not only harness engineering.

The point is not to minimize the harness. The point is that workspace structure, memory, continuity, capability boundaries, and portability need to be designed as first-class system surfaces rather than left implicit inside one executor loop.

## Harnesses still matter

Harness engineering focuses on how a run executes:

- provider/model wiring
- tool schemas
- streaming
- retries
- transport and executor behavior

That work is essential. A harness determines how well a run thinks, plans, invokes tools, handles browsing and attachments, streams progress, and reaches a stable stopping point.

`holaOS` makes a narrower claim: harness engineering determines how a run executes, but it does not by itself define what should remain true before, during, and after that run.

## Why the environment becomes primary

A one-off task system can get surprisingly far with a strong harness. A long-horizon system cannot. Long-horizon work needs:

- a stable workspace that persists authored intent
- memory that survives beyond one session
- continuity that lets the next run resume coherently
- capability governance that is explicit per run
- outputs and operator visibility that keep progress inspectable
- a place where repeated behavior can become durable improvement

Without that environment contract, a capable harness still tends to leave the most important questions under-specified:

- where standing instructions live
- what memory is durable vs volatile
- how the next run restores continuity
- what the agent is actually allowed to see and call
- how the system evolves after repeated work
- what makes the whole unit portable

The shortest version is:

- a harness makes a run capable
- an environment makes capability persist, accumulate, and survive executor changes

You can test the idea with one question: if you replaced the harness tomorrow, what should remain true?

In `holaOS`, these things should still hold:

- the workspace contract
- memory and continuity behavior
- capability projection and visibility rules
- app and integration wiring
- output artifacts
- desktop/operator visibility
- the system's ability to resume work across time

If those invariants should survive a harness swap, then the environment is the primary system artifact and the harness is a subsystem inside it.

## The environment contract

The `holaOS` environment currently defines:

1. workspace structure
   - the authored workspace root and its app/skill surfaces
2. memory surfaces
   - durable markdown memory plus runtime-owned volatile projections
3. continuity artifacts
   - `turn_results`, compaction boundaries, request snapshots, and `session-memory`
4. capability projection
   - the visible and callable surface passed to the harness for each run
5. self-evolving behavior
   - queued follow-up work for durable-memory promotion and candidate skill review
6. harness boundary
   - the reduced execution package that the harness receives
7. packaging and portability
   - what a workspace carries with it and what runtime residue gets omitted

`holaOS` is not only about keeping one run coherent. It is also about making an operating context portable. A workspace should be reproducible, inspectable, and packageable without dragging along transient runtime residue. That is why the environment contract includes packaging boundaries and template surfaces: a workspace can be materialized from a known starting shape, and that starting shape can be reused across machines, teams, and future runs.

## What this enables

Long-horizon work is not just “a longer chat.” It is work that has to continue coherently across runs, survive interruptions, and stay inspectable to both the operator and the system. Environment engineering enables that by giving the system stable places for authored intent, runtime continuity, durable memory, explicit capability surfaces, and reviewable outputs.

Self-improvement also needs somewhere to land. If improvement lives only inside a transient executor loop, it mostly disappears with the run. In `holaOS`, repeated good behavior can accumulate into durable memory, evolve flows, candidate skills, and reusable apps, commands, or templates. That is the difference between a run getting smarter in isolation and the system becoming more capable over time.

## For developers

If you are building on `holaOS`, you are building against an environment contract, not just writing tools for a harness:

- apps are packaged into workspace-local `apps/<app-id>/`
- skills are packaged into workspace-local `skills/`
- memory has explicit storage and governance rules
- the runtime decides capability visibility per run
- the desktop app is one operator shell, not the only surface

That shift is what makes the system easier to inspect, package, resume, and extend.

## Read next

<DocCards>
  <DocCard
    title="Workspace Model"
    eyebrow="Environment Contract"
    href="/holaos/workspace-model"
    description="See how the authored workspace and runtime-owned state are separated."
  />
  <DocCard
    title="Memory and Continuity"
    eyebrow="Long-Horizon State"
    href="/holaos/memory-and-continuity/"
    description="Learn how durable memory and runtime continuity make work resume coherently."
  />
  <DocCard
    title="Runtime APIs"
    eyebrow="Runtime Surface"
    href="/build-on-holaos/runtime-apis"
    description="Inspect the server surface that exposes workspaces, runs, memory, and app orchestration."
  />
  <DocCard
    title="Build on holaOS"
    eyebrow="Developer Path"
    href="/app-development/applications/first-app"
    description="Move from the thesis into the practical path for building apps and templates."
  />
</DocCards>
