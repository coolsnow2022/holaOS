<template>
  <div class="hb-diagram-stack">
    <div class="hb-diagram-stack__pipeline">
      <!-- Desktop -->
      <div class="hb-diagram-stack__layer hb-diagram-stack__layer--surface">
        <div class="hb-diagram-stack__layer-label">🖥️ Desktop</div>
        <div class="hb-diagram-stack__node">
          <span class="hb-diagram-stack__node-name">Electron UI</span>
          <span class="hb-diagram-stack__node-meta">Operator surface</span>
        </div>
      </div>

      <div class="hb-diagram-stack__arrow">→</div>

      <!-- Runtime -->
      <div class="hb-diagram-stack__layer hb-diagram-stack__layer--engine">
        <div class="hb-diagram-stack__layer-label">⚙️ Runtime Bundle</div>
        <div class="hb-diagram-stack__node-group">
          <div class="hb-diagram-stack__node">
            <span class="hb-diagram-stack__node-name">API Server</span>
            <span class="hb-diagram-stack__node-meta">Fastify :8080</span>
          </div>
          <div class="hb-diagram-stack__node">
            <span class="hb-diagram-stack__node-name">State Store</span>
            <span class="hb-diagram-stack__node-meta">SQLite runtime.db</span>
          </div>
          <div class="hb-diagram-stack__boundary">
            <div class="hb-diagram-stack__boundary-label">Execution Boundary</div>
            <div class="hb-diagram-stack__boundary-row">
              <div class="hb-diagram-stack__node hb-diagram-stack__node--compact">
                <span class="hb-diagram-stack__node-name">Harness Host</span>
                <span class="hb-diagram-stack__node-meta">Runtime-owned bridge</span>
              </div>
              <div class="hb-diagram-stack__inline-arrow">→</div>
              <div class="hb-diagram-stack__node hb-diagram-stack__node--compact">
                <span class="hb-diagram-stack__node-name">Agent Harness</span>
                <span class="hb-diagram-stack__node-meta">Selected executor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hb-diagram-stack__arrow">→</div>

      <!-- Workspace -->
      <div class="hb-diagram-stack__layer hb-diagram-stack__layer--context">
        <div class="hb-diagram-stack__layer-label">📂 Workspace</div>
        <div class="hb-diagram-stack__node-group">
          <div class="hb-diagram-stack__node">
            <span class="hb-diagram-stack__node-name">Workspace Apps</span>
            <span class="hb-diagram-stack__node-meta">MCP + UI + Jobs</span>
          </div>
          <div class="hb-diagram-stack__node">
            <span class="hb-diagram-stack__node-name">Workspace Files</span>
            <span class="hb-diagram-stack__node-meta">AGENTS.md · yaml · memory</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hb-diagram-stack {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  padding: 32px 24px;
  container-type: inline-size;
}

.hb-diagram-stack__pipeline {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto minmax(260px, 1.2fr) auto minmax(
      160px,
      1fr
    );
  align-items: center;
  justify-content: center;
  column-gap: 12px;
}

.hb-diagram-stack__layer {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s;
  min-width: 0;
}

.hb-diagram-stack__layer--surface,
.hb-diagram-stack__layer--context {
  width: 100%;
  max-width: 230px;
  justify-self: center;
}

.hb-diagram-stack__layer--engine {
  width: 100%;
  max-width: 360px;
  justify-self: center;
}

.hb-diagram-stack__layer:hover {
  border-color: var(--vp-c-brand-1);
}

.hb-diagram-stack__layer-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.hb-diagram-stack__layer--surface .hb-diagram-stack__layer-label {
  color: var(--vp-c-brand-2);
}

.hb-diagram-stack__layer--engine .hb-diagram-stack__layer-label {
  color: var(--vp-c-brand-1);
}

.hb-diagram-stack__layer--context .hb-diagram-stack__layer-label {
  color: var(--vp-c-brand-3);
}

.hb-diagram-stack__node {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hb-diagram-stack__node--compact {
  flex: 1;
  min-width: 0;
}

.hb-diagram-stack__node-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.hb-diagram-stack__node-meta {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.hb-diagram-stack__node-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hb-diagram-stack__boundary {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px;
  background: var(--vp-c-bg-soft);
}

.hb-diagram-stack__boundary-label {
  margin-bottom: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.hb-diagram-stack__boundary-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hb-diagram-stack__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  color: var(--vp-c-text-3);
  font-size: 18px;
  font-weight: 300;
  flex-shrink: 0;
}

.hb-diagram-stack__inline-arrow {
  color: var(--vp-c-text-3);
  font-size: 16px;
  flex-shrink: 0;
}

@container (max-width: 900px) {
  .hb-diagram-stack__pipeline {
    grid-template-columns: 1fr;
    gap: 12px;
    justify-items: center;
  }

  .hb-diagram-stack__layer--surface,
  .hb-diagram-stack__layer--context,
  .hb-diagram-stack__layer--engine {
    width: min(100%, 420px);
    max-width: 420px;
    justify-self: center;
    align-items: center;
    text-align: center;
  }

  .hb-diagram-stack__node-group,
  .hb-diagram-stack__node {
    align-items: center;
    text-align: center;
  }

  .hb-diagram-stack__boundary {
    width: 100%;
    max-width: 340px;
  }

  .hb-diagram-stack__boundary-label {
    text-align: center;
  }

  .hb-diagram-stack__arrow {
    padding: 0;
    transform: rotate(90deg);
  }

  .hb-diagram-stack__boundary-row {
    justify-content: center;
  }
}

@container (max-width: 560px) {
  .hb-diagram-stack__boundary-row {
    flex-direction: column;
    align-items: stretch;
  }

  .hb-diagram-stack__inline-arrow {
    align-self: center;
    transform: rotate(90deg);
  }
}
</style>
