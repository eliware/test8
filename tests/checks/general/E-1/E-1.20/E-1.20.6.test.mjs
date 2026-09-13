import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../../src/checks/general/E-1/E-1.20/E-1.20.6.mjs";

test("requires a matching npm v3 lockfile", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-lockfile-"));
  await writeFile(join(root, "package-lock.json"), JSON.stringify({ name: "fixture", version: "1.0.0", lockfileVersion: 3 }));
  await expect(run({ root, packageJson: { name: "fixture", version: "1.0.0" } })).resolves.toEqual({ ruleId: "E-1.20.6", status: "pass", message: "" });
  await rm(root, { recursive: true, force: true });
});
