# Runtime Continuity

Runtime continuity is the part of the system that lets the next run resume cheaply and coherently without replaying the full transcript.

It is runtime-owned state, not durable markdown memory.

## Run package and continuity artifacts

Before the harness starts, the runtime compiles the workspace, projects the capability surface, assembles prompt sections and prompt layers, computes a `prompt_cache_profile`, and persists a sanitized request snapshot.

The most important continuity artifacts are:

- `turn_results`
  - normalized run records with status, stop reason, token usage, prompt metadata, request fingerprint, and assistant output
- compaction boundaries
  - durable handoff artifacts that summarize a run boundary, preserve selected turn ids, and define restoration order
- request snapshots
  - sanitized request-state artifacts used for replay, debugging, and cache diagnostics
- `prompt_cache_profile`
  - the runtime split between cacheable and volatile prompt sections for a run
- capability manifest
  - the reduced visible and callable surface passed to the harness for that run
- `memory/workspace/<workspace-id>/runtime/session-memory/`
  - compact continuity snapshots used to restore the next run without replaying the full transcript
- user-memory proposals in `state/runtime.db`
  - staged strong-signal user-memory candidates that the current run can use ephemerally before acceptance

## Continuity writeback

The continuity path after a run is:

1. The runtime persists `turn_results`.
2. An immediate continuity writeback runs inline after the turn result is committed.
3. That writeback updates the compaction boundary, restoration order, and volatile runtime projections under `memory/workspace/<workspace-id>/runtime/`, including `session-memory/`.
4. The runtime then persists a queued evolve job for heavier durable-memory and skill-review work.

The point of this split is to keep the next run cheap to restore without waiting for heavier background extraction.

## What lives where for continuity

Use these rules of thumb when reasoning about resume state:

- `state/runtime.db`
  - execution truth, session continuity, canonical runtime profile, user-memory proposals, and memory catalog metadata
- `memory/workspace/<workspace-id>/runtime/`
  - volatile runtime projections for inspection and debugging
- `memory/workspace/<workspace-id>/runtime/session-memory/`
  - session-scoped continuity snapshots used during resume restoration

If a piece of information is only needed to resume the latest session, it belongs in runtime continuity rather than durable memory. Repeated blockers can begin in runtime projections first and only later be promoted into durable `knowledge/blockers/` during queued evolve.
