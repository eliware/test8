import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/mcp-server/A-1.80.0.mjs";

test("requires MCP guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-mcp-"));
  await writeFile(join(root, "AGENTS.md"), "mcp\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "repository\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
