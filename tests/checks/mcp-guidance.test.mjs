import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/mcp-server/A-1.80.0.mjs";

test("accepts AGENTS.md with MCP guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-guidance-"));
  await writeFile(join(root, "AGENTS.md"), "This MCP server exposes tools.\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0",
    status: "pass",
  });
});

test("rejects AGENTS.md without MCP guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-guidance-"));
  await writeFile(join(root, "AGENTS.md"), "This server exposes tools.\n");

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0",
    status: "fail",
  });
});

test("rejects missing AGENTS.md", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-mcp-guidance-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.80.0",
    status: "fail",
    message: "AGENTS.md is required.",
  });
});
