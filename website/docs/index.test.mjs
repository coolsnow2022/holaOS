import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const APP_PACKAGE_PATH = new URL("./package.json", import.meta.url);
const WORKER_PATH = new URL("./src/worker.ts", import.meta.url);
const WRANGLER_PATH = new URL("./wrangler.jsonc", import.meta.url);
const VITEPRESS_CONFIG_PATH = new URL(
  "./docs/.vitepress/config.ts",
  import.meta.url
);
const THEME_ENTRY_PATH = new URL(
  "./docs/.vitepress/theme/index.ts",
  import.meta.url
);
const THEME_CSS_PATH = new URL(
  "./docs/.vitepress/theme/custom.css",
  import.meta.url
);
const DOC_CARDS_PATH = new URL(
  "./docs/.vitepress/theme/components/DocCards.vue",
  import.meta.url
);
const DOC_CARD_PATH = new URL(
  "./docs/.vitepress/theme/components/DocCard.vue",
  import.meta.url
);
const DOC_STEPS_PATH = new URL(
  "./docs/.vitepress/theme/components/DocSteps.vue",
  import.meta.url
);
const DOC_STEP_PATH = new URL(
  "./docs/.vitepress/theme/components/DocStep.vue",
  import.meta.url
);
const DOC_DEFINITION_PATH = new URL(
  "./docs/.vitepress/theme/components/DocDefinition.vue",
  import.meta.url
);
const DOC_TERM_PATH = new URL(
  "./docs/.vitepress/theme/components/DocTerm.vue",
  import.meta.url
);
const ROOT_PACKAGE_PATH = new URL("../../package.json", import.meta.url);

test("docs app exposes vitepress build and preview scripts", async () => {
  const source = await readFile(APP_PACKAGE_PATH, "utf8");

  assert.match(source, /"build":\s*"vitepress build docs"/);
  assert.match(source, /"dev":\s*"vitepress dev docs/);
  assert.match(source, /"docs:dev":\s*"vitepress dev docs/);
  assert.match(source, /"docs:preview":\s*"vitepress preview docs/);
  assert.match(
    source,
    /"deploy:staging":\s*"npm run build && wrangler deploy --env staging"/
  );
  assert.match(
    source,
    /"deploy:production":\s*"npm run build && wrangler deploy --env production"/
  );
  assert.match(source, /"vitepress-mermaid-renderer":/);
});

test("vitepress config is set up for the agreed documentation structure", async () => {
  const source = await readFile(VITEPRESS_CONFIG_PATH, "utf8");

  assert.match(source, /base:\s*"\/docs\/"/);
  assert.match(source, /provider:\s*"local"/);
  assert.match(source, /text:\s*"Get Started"/);
  assert.match(source, /text:\s*"holaOS"/);
  assert.match(source, /text:\s*"Build on holaOS"/);
  assert.match(source, /text:\s*"Holaboss Desktop"/);
  assert.match(source, /text:\s*"Reference"/);
  assert.match(source, /text:\s*"Runtime"/);
  assert.match(source, /"\/getting-started\/"/);
  assert.match(source, /"\/getting-started\/learning-path"/);
  assert.match(source, /"\/holaos\/concepts"/);
  assert.match(source, /"\/holaos\/apps"/);
  assert.match(source, /"\/holaos\/agent-harness\/"/);
  assert.match(source, /"\/holaos\/agent-harness\/adapter-capabilities"/);
  assert.match(source, /"\/holaos\/agent-harness\/runtime-tools"/);
  assert.match(source, /"\/holaos\/agent-harness\/mcp-support"/);
  assert.match(source, /"\/holaos\/agent-harness\/skills-usage"/);
  assert.match(source, /"\/holaos\/agent-harness\/model-routing"/);
  assert.match(source, /"\/holaos\/agent-harness\/normalized-lifecycle"/);
  assert.match(source, /"\/holaos\/workspace-model"/);
  assert.match(source, /"\/holaos\/memory-and-continuity\/"/);
  assert.match(source, /"\/holaos\/memory-and-continuity\/runtime-continuity"/);
  assert.match(source, /"\/desktop\/workspace-experience"/);
  assert.match(source, /"\/build-on-holaos\/desktop\/internals"/);
  assert.match(source, /"\/app-development\/applications\/first-app"/);
  assert.match(source, /"\/templates\/"/);
  assert.match(source, /"\/templates\/structure"/);
  assert.match(source, /"\/build-on-holaos\/runtime-apis"/);
  assert.match(source, /"\/build-on-holaos\/independent-deploy"/);
  assert.match(source, /"\/build-on-holaos\/agent-harness\/internals"/);
  assert.match(source, /"\/build-on-holaos\/start-developing\/"/);
  assert.match(source, /"\/build-on-holaos\/start-developing\/contributing"/);
  assert.match(source, /"\/build-on-holaos\/troubleshooting"/);
  assert.match(source, /"\/reference\/environment-variables"/);
  assert.doesNotMatch(source, /"\/desktop\/quickstart"/);
  assert.doesNotMatch(source, /link:\s*"\/concepts"/);
  assert.doesNotMatch(source, /link:\s*"\/learning-path"/);
  assert.doesNotMatch(source, /"\/app-development\/agent-harness"/);
  assert.doesNotMatch(source, /"\/holaos\/agent-harness\/capabilities"/);
  assert.doesNotMatch(source, /"\/holaos\/agent-harness\/baseline-tools"/);
  assert.doesNotMatch(source, /"\/holaos\/agent-harness\/browser-use"/);
  assert.doesNotMatch(
    source,
    /"\/holaos\/agent-harness\/attachments-and-model-routing"/
  );
  assert.doesNotMatch(
    source,
    /"\/build-on-holaos\/start-developing\/agent-harness"/
  );
  assert.doesNotMatch(source, /text:\s*"OSS"/);
  assert.doesNotMatch(source, /text:\s*"Product"/);
  assert.doesNotMatch(source, /text:\s*"Developers"/);
});

test("docs root page is a normal documentation page instead of a home hero landing page", async () => {
  const source = await readFile(
    new URL("./docs/index.md", import.meta.url),
    "utf8"
  );

  assert.doesNotMatch(source, /layout:\s*home/);
  assert.match(source, /# Overview/);
  assert.match(source, /## Read Next/);
});

test("vitepress theme extends the default theme and registers shared doc components", async () => {
  const source = await readFile(THEME_ENTRY_PATH, "utf8");

  assert.match(source, /import DefaultTheme from "vitepress\/theme"/);
  assert.match(source, /createMermaidRenderer/);
  assert.match(source, /GlobalTopBar/);
  assert.match(source, /app\.component\("DocCards"/);
  assert.match(source, /app\.component\("DocCard"/);
  assert.match(source, /app\.component\("DocSteps"/);
  assert.match(source, /app\.component\("DocStep"/);
  assert.match(source, /app\.component\("DocDefinition"/);
  assert.match(source, /app\.component\("DocTerm"/);
  assert.match(source, /import "\.\/custom\.css"/);
});

test("shared documentation components and mermaid styles exist", async () => {
  const files = [
    THEME_CSS_PATH,
    DOC_CARDS_PATH,
    DOC_CARD_PATH,
    DOC_STEPS_PATH,
    DOC_STEP_PATH,
    DOC_DEFINITION_PATH,
    DOC_TERM_PATH,
  ];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.ok(source.length > 0);
  }

  const cssSource = await readFile(THEME_CSS_PATH, "utf8");
  assert.match(cssSource, /\.mermaid-container/);
  assert.match(cssSource, /\.HBGlobalTopBar/);
});

test("docs worker strips the /docs prefix before serving static assets", async () => {
  const source = await readFile(WORKER_PATH, "utf8");

  assert.match(
    source,
    /pathname\.replace\(\s*\/\^\\\/docs\(\?=\\\/\|\$\)\/\s*,\s*""\s*\)/
  );
  assert.match(source, /env\.ASSETS\.fetch/);
});

test("wrangler config serves vitepress output and binds the docs routes", async () => {
  const source = await readFile(WRANGLER_PATH, "utf8");

  assert.match(source, /"main":\s*"src\/worker\.ts"/);
  assert.match(source, /"binding":\s*"ASSETS"/);
  assert.match(source, /"directory":\s*"docs\/\.vitepress\/dist"/);
  assert.match(source, /"run_worker_first":\s*true/);
  assert.match(source, /"not_found_handling":\s*"404-page"/);
  assert.match(source, /www\.holaboss\.ai\/docs\*/);
  assert.match(source, /www\.imerchstaging\.com\/docs\*/);
});

test("holaOS root scripts expose docs entrypoints", async () => {
  const source = await readFile(ROOT_PACKAGE_PATH, "utf8");

  assert.match(source, /"docs:dev":\s*"npm --prefix website\/docs run dev"/);
  assert.match(source, /"docs:test":\s*"npm --prefix website\/docs run test"/);
  assert.match(source, /"docs:build":\s*"npm --prefix website\/docs run build"/);
  assert.match(
    source,
    /"docs:deploy:production":\s*"npm --prefix website\/docs run deploy:production"/
  );
});
