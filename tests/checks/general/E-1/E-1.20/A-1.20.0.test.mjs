import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/A-1.20.0.mjs";

test("requires Node validation guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-node-"));
  await writeFile(join(root, "AGENTS.md"), "Node.js 26 native ESM .mjs module environment validation");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, "AGENTS.md"), "Node.js");
  expect((await run({ root })).status).toBe("fail");
});
