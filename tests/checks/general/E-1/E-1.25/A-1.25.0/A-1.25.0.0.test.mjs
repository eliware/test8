import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../../../src/checks/general/E-1/E-1.25/A-1.25.0/A-1.25.0.0.mjs";

test("resolves local structured references", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-refs-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "target.json"), "{}");
  await writeFile(join(root, "specs", "source.json"), JSON.stringify({ crosslink: { path: "./target.json" } }));
  expect((await run({ root })).status).toBe("pass");
  await mkdir(join(root, "records"));
  await writeFile(join(root, "records", "target.json"), "{}");
  await writeFile(join(root, "specs", "source.json"), JSON.stringify({ crosslink: { path: "../records/target.json" } }));
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, "specs", "source.json"), JSON.stringify({ crosslink: { path: "./missing.json" } }));
  expect((await run({ root })).status).toBe("fail");
});
