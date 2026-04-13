# Template Versioning

Templates should be versioned like product artifacts. The goal is reproducibility: if someone creates a workspace from a template today, they should be able to create the same starting point later.

## Recommended strategy

Use git tags for stable releases and commit SHAs for exact pinning.

| Reference type | Best for | Notes |
| --- | --- | --- |
| Tag | Stable template releases | Good default for workspace creation flows |
| Commit SHA | Exact reproducibility | Best when you want an immutable template snapshot |
| Branch | Active development | Useful for local iteration, not ideal for long-lived public references |

## Versioning policy

<DocSteps>
  <DocStep title="Develop on a branch">
    Make template changes in a normal branch while you are iterating.
  </DocStep>
  <DocStep title="Cut a release tag">
    Tag a stable release when the template is ready for reuse, for example `v0.1.0`.
  </DocStep>
  <DocStep title="Pin the reference">
    Use the tag in the Workspace Manager so materialization always resolves to the same release.
  </DocStep>
  <DocStep title="Use SHAs for audits">
    When you need a forensic record, pin the exact commit SHA that produced the workspace.
  </DocStep>
</DocSteps>

## Suggested naming

Keep tags simple and semantic:

- `v0.1.0`
- `v0.2.0`
- `v1.0.0`

If a template changes in a backwards-incompatible way, bump the major version. If the layout changes but the public contract stays the same, use minor or patch releases.

## What should trigger a new release

- changes to required root files
- changes to `workspace.yaml` semantics
- changes to app manifests or startup assumptions
- changes to skills that alter behavior in a user-visible way

## What should not trigger a release by itself

- small wording changes in optional docs
- non-functional cleanup
- internal refactors that do not affect the materialized workspace

::: tip
If a change affects how a fresh workspace starts, treat it like a release-worthy change.
:::

