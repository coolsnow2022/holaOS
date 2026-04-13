# Recall and Evolve

`holaOS` splits memory work into an immediate continuity phase and a slower evolve phase.

That separation is what keeps the next run cheap to restore while still allowing durable memory, recall, and skill review to improve over time.

## Memory lifecycle

The current flow is:

1. User input is queued, and strong-signal user-scoped proposals may be captured in `state/runtime.db`.
2. The runtime compiles the workspace, projects capabilities, computes the prompt package, and persists a sanitized request snapshot before the harness starts.
3. The current run may use pending proposals as ephemeral context without promoting them into durable memory yet.
4. When the run finishes, the runtime persists `turn_results`.
5. An immediate continuity writeback runs inline after the turn result is committed.
6. That writeback updates the compaction boundary, restoration order, and volatile runtime projections under `memory/workspace/<workspace-id>/runtime/`, including `session-memory/`.
7. The runtime then persists a queued evolve job for heavier durable-memory and skill-review work.
8. The evolve worker reloads the finished turn, recent session state, and current memory catalog state.
9. Deterministic and optional model-assisted extraction promote durable workspace facts, procedures, blockers, preference memories, and identity memories into markdown memory plus catalog rows.
10. `MEMORY.md` indexes are refreshed only for the durable scopes that changed.
11. Later runs restore from the latest compaction boundary first, then enrich continuity from `session-memory` and bounded durable recall.

User-memory proposals remain staged in `state/runtime.db` until they are accepted. Repeated runtime blockers can also graduate into durable `knowledge/blockers/` during queued evolve when they stop looking like a one-off run artifact and start looking like stable workspace knowledge.

## Recall behavior

Runtime recall is manifest-based. The runtime scans durable markdown memory files, reads summaries and metadata, and selects a bounded set of entries to inject as context.

Important characteristics:

- runtime continuity is restored before broader memory recall
- durable memory is selected from indexed markdown, not from raw session transcripts
- stale or low-confidence memory should be penalized more than stable workspace facts
- time-sensitive `reference` memory should usually be reconfirmed before action
- recalled memory is context, not a rewrite of the base system prompt

## Immediate continuity vs queued evolve

`holaOS` splits post-run work into two phases:

1. `write_turn_continuity`
   - runs inline after the foreground `turn_results` row is committed
   - keeps next-run continuity fresh without waiting on heavier extraction work
2. `queued_evolve`
   - persists as a queue job in `state/runtime.db`
   - drains through a dedicated evolve worker
   - handles durable-memory promotion, index refresh, and background skill review

The queued evolve phase handles slower work such as:

- deterministic durable candidate extraction
- optional model-assisted durable extraction when background tasks are configured
- durable markdown upserts and `MEMORY.md` refresh
- reusable workspace skill review and candidate drafting

## Skill candidate lifecycle

Reusable procedural patterns do not become live skills automatically. The current lifecycle is:

1. queued evolve reviews a cadence turn
2. if it finds a reusable pattern, it writes a draft under `memory/workspace/<workspace-id>/evolve/skills/<candidate-id>/SKILL.md`
3. the runtime stores candidate metadata in `state/runtime.db`
4. candidate skills that merit attention are raised through proposal surfaces rather than silently activated
5. an accepted proposal opens a tightly scoped review session
6. after successful review, the candidate can be promoted into the live workspace `skills/` namespace

## Recall governance

Durable recall is governed separately from storage:

- every durable memory entry carries a scope, type, verification policy, and staleness policy
- every durable memory entry also carries provenance metadata such as source type, observation time, verification time, and confidence
- recall should prefer user preferences first, then query-matched workspace procedures, facts, blockers, and references
- stale references should be penalized more aggressively than stable or workspace-sensitive memories
- recalled durable memory is injected as context, not merged into the base system prompt

Recall selection is staged at query time. The runtime reads durable-memory indexes, and when recall embeddings are available it can first narrow candidate paths through a derived vector index. It then reads only those candidate leaf files and finalizes a small recalled subset for prompt injection. Markdown leaves remain the canonical content source, while vector rows stay derived recall acceleration only.
