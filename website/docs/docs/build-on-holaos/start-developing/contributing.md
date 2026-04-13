# Contributing

Use this page as the contributor-specific companion to [Start Developing](/build-on-holaos/start-developing/).

It covers the expectations around PR scope, validation, and review once your local environment is already running.

## Before opening a PR

- open an issue first for large changes, product-surface changes, or workflow changes
- keep PRs narrow so behavior changes and refactors are easier to review and ship safely
- avoid checking in secrets, private backend endpoints, or internal-only credentials

## Common validation

The baseline validation flow is:

```bash
npm run desktop:typecheck
npm run runtime:test
```

## Pull requests

- write a clear title and description
- explain user-visible behavior changes and any migration impact
- update docs when setup, runtime behavior, or public workflows change
- add or update tests when behavior changes in `runtime/`

## Review expectations

- PRs should be mergeable, scoped, and pass required checks
- breaking changes should be called out explicitly
- maintainers may request follow-up cleanup before merge when repo-wide consistency is affected
