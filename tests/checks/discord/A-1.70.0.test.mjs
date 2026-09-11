import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/discord/A-1.70.0.mjs";

test("requires Discord guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-discord-"));
  await writeFile(join(root, "AGENTS.md"), "discord\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "AGENTS.md"), "repository\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
