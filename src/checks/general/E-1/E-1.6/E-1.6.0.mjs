import { readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, relative } from "node:path";
import { fail, pass } from "../../../check-result.mjs";

export const ruleId = "E-1.6.0";
export const parentRuleId = "E-1.6";

const ignoredDirectories = new Set([".git", "node_modules", "coverage", "build", "dist", "target"]);
const forbidden = /(^|\b)(?:credentials?|secrets?|backup|dump|restore|runtime-state|session)(?:\b|[._-])|\.(?:env|pem|key|p12|pfx)$/i;
const execFileAsync = promisify(execFile);

async function collect(directory, root, findings) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path, root, findings);
    else if (entry.isFile() && entry.name !== ".env.example" && forbidden.test(entry.name)) {
      findings.push(relative(root, path).replaceAll("\\", "/"));
    }
  }
}

async function trackedPaths(root) {
  try {
    const { stdout } = await execFileAsync("git", ["-C", root, "ls-files", "-z"], { windowsHide: true });
    return stdout.split("\0").filter(Boolean);
  } catch {
    return null;
  }
}

export async function run({ root, packageJson }) {
  const findings = [];
  try {
    const tracked = await trackedPaths(root);
    if (tracked) {
      const exemptions = packageJson?.eliware?.exempt ?? [];
      const allowed = new Set(exemptions.filter((entry) => entry.ruleId === ruleId && typeof entry.path === "string").map((entry) => entry.path.replaceAll("\\", "/")));
      findings.push(...tracked.filter((path) => path.split("/").some((part) => forbidden.test(part)) && !path.endsWith(".env.example") && !allowed.has(path)));
    } else {
      await collect(root, root, findings);
    }
  } catch {
    return fail(ruleId, "Repository contents could not be inspected for secret or runtime-state artifacts.");
  }
  if (findings.length > 0) return fail(ruleId, `Unauthorized secret or runtime-state paths found: ${findings.join(", ")}.`);
  return pass(ruleId);
}
