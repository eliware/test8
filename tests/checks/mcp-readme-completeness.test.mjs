import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/mcp-server/A-1.80.2.mjs";

const topics = [
  "purpose",
  "requirements",
  "setup",
  "configuration",
  "tools",
  "resources",
  "prompts",
  "transport",
  "authentication",
  "schemas",
  "validation",
  "operations",
  "security",
  "support",
  "license",
];

test("accepts an MCP README covering all required topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-readme-"));
  await writeFile(join(root, "README.md"), topics.join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.2",
    status: "pass",
  });
});

test("rejects an MCP README missing a required topic", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-readme-"));
  await writeFile(join(root, "README.md"), topics.slice(0, 4).join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.2",
    status: "fail",
  });
});

test("rejects a missing MCP README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-readme-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.2",
    status: "fail",
    message: "README.md is required.",
  });
});
