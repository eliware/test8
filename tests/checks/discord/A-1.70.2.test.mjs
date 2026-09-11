import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/discord/A-1.70.2.mjs";

test("requires Discord README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-discord-"));
  await writeFile(
    join(root, "README.md"),
    "purpose requirements setup configuration commands events intents permissions validation operations security support license\n",
  );
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "README.md"), "purpose\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
});
