import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/mcp-server/E-1.80/A-1.80.0/A-1.80.0.1.mjs";

test("requires MCP protocol topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-mcp-topics-"));
  await writeFile(join(root, "AGENTS.md"), "tools resources prompts transport authentication schemas protocol validation");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.80.0.1", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
