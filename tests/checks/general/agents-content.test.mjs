import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { checkAgents } from "../../../src/checks/general/agents-content.mjs";

test("matches required AGENTS guidance and reports missing content", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-agents-"));
  await writeFile(join(root, "AGENTS.md"), "repository purpose\n");
  expect((await checkAgents(root, "A-1.0.0", [["repository"], ["purpose"]])).status).toBe("pass");
  expect((await checkAgents(root, "A-1.0.0", [["repository"], ["missing"]])).status).toBe("fail");
});
