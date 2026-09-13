import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/mcp-server/E-1.80/A-1.80.2.mjs";

test("requires MCP README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-mcp-readme-"));
  await writeFile(join(root, "README.md"), "purpose requirements setup configuration tools resources prompts transport authentication schemas validation operations security support license");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.80.2", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
