# MCP Tools

MCP tools are the primary way a workspace app participates in the Holaboss agent loop.

The agent does not care about your internal implementation details. It cares that the tool name is obvious, the input schema is strict, and the output is easy to parse.

## Tool naming

Use a stable app prefix.

Examples from the current apps:

- `twitter_create_post`
- `twitter_publish_post`
- `gmail_search`
- `gmail_draft_reply`
- `gmail_send_draft`

Some starter templates still use placeholder names like `module_create_post`. Replace those before shipping the app.

## Good tool shape

<DocSteps>
  <DocStep title="One tool, one job">
    Keep each tool focused on a single user-intent. Avoid giant tools that combine search, edit, and publish in one call.
  </DocStep>
  <DocStep title="Validate input with zod">
    Use explicit field types and short descriptions so the agent can form a correct request.
  </DocStep>
  <DocStep title="Return machine-readable text">
    The current shipped apps return JSON inside text content, which makes the output easy to inspect and forward.
  </DocStep>
  <DocStep title="Mark failures clearly">
    Return an error payload when the tool cannot complete the requested action.
  </DocStep>
</DocSteps>

## Recommended tool categories

| Category | Example | Why it helps |
| --- | --- | --- |
| Create | `twitter_create_post` | Lets the agent create a draft record immediately |
| List | `gmail_list_drafts` | Gives the agent a bounded view of local state |
| Inspect | `twitter_get_post` | Lets the agent re-read a specific record |
| Action | `twitter_publish_post` | Starts a durable workflow such as queueing or publishing |
| Status | `twitter_get_publish_status` | Gives the agent a safe follow-up query |

## Error handling

Follow the same pattern used in the shipped apps:

```ts
if (!post) {
  return { content: [{ type: "text" as const, text: "Post not found" }], isError: true }
}
```

That shape is simple, explicit, and easy for the agent to recover from.

## Practical tips

- Prefer JSON payloads over prose responses.
- Keep summaries short when the result is large.
- Do not hide side effects behind read-only sounding tool names.
- If a tool queues work, return the job id or record id immediately.
- If a tool is unsafe, make the action explicit in the tool name and description.

## Transport and health

Current apps expose MCP over SSE and serve a lightweight health endpoint:

- `/mcp/health`
- `/mcp/sse`
- `/mcp/messages`

The runtime manifest should point at the same path your server actually serves.

## When to add a tool

Add a tool only when the agent needs to:

- create a record
- update a record
- inspect state
- start a workflow
- check progress

If the agent does not need to invoke it, keep it out of MCP and expose it only through the UI.
