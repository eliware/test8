import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/mcp-server/A-1.80.0.1.mjs";

const topics = "tools resources prompts transport authentication schemas protocol";

test("accepts AGENTS.md with all MCP topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-agents-"));
  await writeFile(join(root, "AGENTS.md"), topics);

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0.1",
    status: "pass",
  });
});

test("rejects AGENTS.md missing an MCP topic", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-agents-"));
  await writeFile(join(root, "AGENTS.md"), "tools resources prompts transport");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0.1",
    status: "fail",
  });
});

test("rejects missing AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-agents-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0.1",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
