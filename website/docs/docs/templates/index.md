# Workspace Templates

A workspace template is the reusable starting shape for a workspace.

It packages initial policy, skills, apps, and conventions so a new workspace begins from a known operating context instead of from an empty folder.

## Why templates exist

Templates exist so workspace creation is reproducible, reusable, and portable.

They help with:

- reproducible workspace creation
- reusable operating environments
- cleaner onboarding
- portable starting points for specific workflows or domains
- separation between portable authored state and transient runtime residue

In `holaOS`, that portability matters because environment engineering is not only about execution continuity. It is also about being able to package and recreate an operating context cleanly.

## Template vs workspace vs app

Use the terms this way:

| Surface | Main role |
| --- | --- |
| Template | The starting shape for a workspace |
| Workspace | The live operating context after materialization |
| App | A packaged capability installed inside a workspace |

A template is not the live workspace itself. It is the reusable scaffold that becomes one.

## How templates fit into holaOS

Templates are one of the portability surfaces of the environment.

They let `holaOS` keep a clean distinction between:

- the authored starting shape that should be reusable
- the live workspace that accumulates state over time
- the runtime residue that should not travel with the portable unit

That is why templates sit alongside packaging boundaries in the environment story. They make a workspace reproducible without turning the runtime's transient state into part of the reusable artifact.

## How a workspace gets created

In practice, a workspace can be created from:

- an empty scaffold
- a local template folder
- a marketplace template

All of those paths should materialize into the same workspace model. The creation path can differ, but the resulting operating context should follow the same `holaOS` contracts.

## Read next

<DocCards>
  <DocCard
    title="Template Structure"
    eyebrow="Workspace Shape"
    href="/templates/structure"
    description="See the typical files, folders, and conventions that a workspace template should include."
  />
  <DocCard
    title="Template Versioning"
    eyebrow="Release Policy"
    href="/templates/versioning"
    description="See how to version templates so workspace creation stays reproducible across time."
  />
</DocCards>
