# Durable Memory

Durable memory is the part of the system that should survive beyond one run and be recallable later without replaying the entire session.

## Durable vs volatile

The runtime memory model is intentionally split:

| Layer | Purpose | Durable? |
| --- | --- | --- |
| `state/runtime.db` | execution truth, profile state, continuity boundaries | yes |
| `memory/workspace/<workspace-id>/runtime/` | latest-turn projections, blockers, recent-turn snapshots | no |
| `memory/workspace/<workspace-id>/runtime/session-memory/` | resume-friendly continuity snapshots | semi-volatile |
| `memory/workspace/<workspace-id>/knowledge/` | workspace facts, procedures, blockers, reference memories | yes |
| `memory/preference/` | user preferences | yes |
| `memory/identity/` | user identity memory | yes |

Runtime files under `runtime/` are for inspection and restoration. They are not treated as durable knowledge.

## Durable memory types

The durable memory catalog currently supports these classes:

- `preference`
  - stable user preferences such as response style
- `identity`
  - durable identity facts beyond the canonical runtime profile
- `fact`
  - workspace command facts or business facts that should survive later runs
- `procedure`
  - reusable operational steps such as release, onboarding, follow-up, or handoff workflows
- `blocker`
  - recurring permission or execution blockers that appear across turns
- `reference`
  - durable references that should usually be reconfirmed before use

Current writeback is intentionally conservative. The runtime should only promote facts and procedures that are explicit enough to survive beyond a single turn, and it should keep transient runtime state out of durable knowledge.

## What lives where

Use these rules of thumb when reasoning about durable state:

- `AGENTS.md`
  - human-authored workspace policy and operating instructions
- `memory/workspace/<workspace-id>/knowledge/`
  - durable workspace memory that may be recalled in later runs
- `memory/preference/`
  - durable user preference memory
- `memory/identity/`
  - durable user identity facts beyond the canonical runtime profile

If it should be recalled later without replaying the full session, it belongs in durable memory. If it is a standing workspace rule, it belongs in `AGENTS.md`.

## Namespace boundaries

Memory paths are memory-root-relative. The runtime rejects:

- absolute paths
- `..` traversal
- paths that escape the memory root

The current namespace model allows:

- root index: `MEMORY.md`
- workspace scope: `workspace/<workspace-id>/*`
- user/global scopes such as `preference/*` and `identity/*`

Cross-workspace access is blocked. A workspace can only read or write its own scoped memory.
