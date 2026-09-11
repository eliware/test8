import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run as runAgents } from "../../src/checks/general/A-1.20.0.mjs";
import { run as runScripts } from "../../src/checks/general/A-1.20.11.mjs";
import { run as runCi } from "../../src/checks/general/A-1.20.11.0.mjs";

const roots = [];

async function rootWithAgents(text) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-node-config-"));
  roots.push(root);
  if (text !== undefined) await writeFile(join(root, "AGENTS.md"), text);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("validates required Node instructions in AGENTS.md", async () => {
  const root = await rootWithAgents(
    "Node.js 26 runtime commands environment ESM validation test lint",
  );
  await expect(runAgents({ root })).resolves.toEqual({
    ruleId: "A-1.20.0",
    status: "pass",
    message: "",
  });
  await expect(runAgents({ root: `${root}-missing` })).resolves.toMatchObject({
    ruleId: "A-1.20.0",
    status: "fail",
  });
});

test("rejects empty declared build and typecheck scripts", () => {
  expect(runScripts({ packageJson: { scripts: { build: "", typecheck: "ok" } } })).toMatchObject({
    ruleId: "A-1.20.11",
    status: "fail",
  });
  expect(runScripts({ packageJson: { scripts: {} } })).toEqual({
    ruleId: "A-1.20.11",
    status: "pass",
    message: "",
  });
});

test("requires declared build and typecheck scripts in CI", async () => {
  await expect(
    runCi({ root: await rootWithAgents("instructions"), packageJson: { scripts: {} } }),
  ).resolves.toEqual({
    ruleId: "A-1.20.11.0",
    status: "pass",
    message: "",
  });
  const root = await rootWithAgents("instructions");
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "validation.yml"), "npm run build\n");
  await expect(
    runCi({ root, packageJson: { scripts: { build: "build", typecheck: "check" } } }),
  ).resolves.toMatchObject({
    ruleId: "A-1.20.11.0",
    status: "fail",
  });
  await writeFile(
    join(root, ".github", "workflows", "validation.yml"),
    "npm run build\nnpm run typecheck\n",
  );
  await expect(
    runCi({ root, packageJson: { scripts: { build: "build", typecheck: "check" } } }),
  ).resolves.toEqual({
    ruleId: "A-1.20.11.0",
    status: "pass",
    message: "",
  });
});

test("fails when declared build has no workflow and accepts alternate workflow names", async () => {
  const root = await rootWithAgents("instructions");
  await expect(
    runCi({ root, packageJson: { scripts: { build: "build" } } }),
  ).resolves.toMatchObject({
    ruleId: "A-1.20.11.0",
    status: "fail",
  });
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "ci.yaml"), "npm run build\n");
  await expect(runCi({ root, packageJson: { scripts: { build: "build" } } })).resolves.toEqual({
    ruleId: "A-1.20.11.0",
    status: "pass",
    message: "",
  });
});
