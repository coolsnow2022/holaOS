import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const desktopRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(desktopRoot, "out");
const outputPath = path.join(outputDir, "holaboss-config.json");

const config = {
  authBaseUrl: process.env.HOLABOSS_AUTH_BASE_URL?.trim() || "",
  authSignInUrl: process.env.HOLABOSS_AUTH_SIGN_IN_URL?.trim() || "",
  backendBaseUrl: process.env.HOLABOSS_BACKEND_BASE_URL?.trim() || "",
  desktopControlPlaneBaseUrl: process.env.HOLABOSS_DESKTOP_CONTROL_PLANE_BASE_URL?.trim() || "",
  projectsUrl: process.env.HOLABOSS_PROJECTS_URL?.trim() || process.env.HOLABOSS_CLI_PROJECTS_URL?.trim() || "",
  marketplaceUrl:
    process.env.HOLABOSS_MARKETPLACE_URL?.trim() || process.env.HOLABOSS_CLI_MARKETPLACE_URL?.trim() || "",
  proactiveUrl:
    process.env.HOLABOSS_PROACTIVE_URL?.trim() || process.env.HOLABOSS_CLI_PROACTIVE_URL?.trim() || ""
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

process.stdout.write(`[packaged-config] wrote ${outputPath}\n`);
