# Normalized Lifecycle

The harness contract is not only about what goes in. It is also about what comes back out.

## Current event types

The harness host emits normalized runner events back into the runtime path. Current event types include:

- `run_claimed`
- `run_started`
- `thinking_delta`
- `output_delta`
- `tool_call`
- `skill_invocation`
- `auto_compaction_start`
- `auto_compaction_end`
- `run_completed`
- `run_failed`

`run_completed` is not always a fully finished success path. It can also carry `status: waiting_user` when the run has reached a stable handoff point and is now blocked on user input.

## What normalization gives the system

This normalization lets the runtime and desktop observe runs without depending on one harness's native event format.

That means:

- session observers can stay consistent
- desktop UI can render run progress against a stable event vocabulary
- a completed `question` tool call can move the active todo into a waiting-for-user state without inventing a separate executor-specific event family
- a future harness can fit into the same observation pipeline if it emits the normalized contract

## Not just logging

These events are part of the execution boundary itself. They define how the rest of the system can understand the run after control has crossed into the harness.

That is what makes them a real contract surface rather than a debugging convenience.
