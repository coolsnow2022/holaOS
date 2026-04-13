# Publishing Outputs

Workspace outputs are the durable records that make an app's work visible in Holaboss.

Use outputs for items the operator should be able to revisit later, such as:

- drafts
- queued items
- published content
- synced external records
- app resources that need a stable workspace representation

## Output lifecycle

<DocSteps>
  <DocStep title="Create the local record">
    Store the app's canonical record in SQLite or the app's local data layer first.
  </DocStep>
  <DocStep title="Create a workspace output">
    Call `createAppOutput()` when the record should appear in the Holaboss workspace.
  </DocStep>
  <DocStep title="Update status over time">
    Use `updateAppOutput()` when the record moves from draft to queued, published, sent, or synced.
  </DocStep>
  <DocStep title="Keep metadata consistent">
    Make sure the workspace output metadata still points back to the local record id.
  </DocStep>
</DocSteps>

## Output fields

The bridge currently writes the following important fields:

| Field | Purpose |
| --- | --- |
| `outputType` | Category of output, such as a post or thread |
| `title` | Human-readable title shown in workspace views |
| `moduleId` | The app that owns the record |
| `moduleResourceId` | App-local resource id used for cross-linking |
| `platform` | Optional platform label, such as a social network or external system |
| `status` | Draft, queued, published, sent, or another lifecycle state |
| `metadata` | Extra JSON metadata for view and sync information |

## Status design

Use statuses that describe the real lifecycle of the item.

Good examples:

- `draft`
- `queued`
- `published`
- `sent`
- `synced`

Keep the status vocabulary consistent within an app. Do not invent new words for the same lifecycle step.

## Good publishing behavior

- Create the output once the item is meaningful to the operator.
- Update it when the real-world action completes.
- Preserve the local record id in metadata.
- Use a stable title that helps the operator identify the item later.
- Avoid publishing transient internal state unless the operator needs it.

## App resource presentations

When an output should open into a specific resource view, use `buildAppResourcePresentation({ view, path })`.

That keeps the workspace UI consistent and prevents each app from inventing its own navigation shape.

## Example pattern

The shipped apps use this general order:

1. Save a draft locally.
2. Create the workspace output.
3. Queue or publish the external action.
4. Patch the output with the final status.

That pattern works well for social posts, email drafts, and other multi-step workflows.

## When not to publish

Do not create an output for:

- ephemeral helper data
- internal retries
- throwaway preview state
- request payloads that are never meant to be revisited

If the operator will not want to inspect it later, keep it local.
