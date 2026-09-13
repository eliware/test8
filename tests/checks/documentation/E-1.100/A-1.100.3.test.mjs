import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/documentation/E-1.100/A-1.100.3.mjs";

test("validates local structured references", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-doc-refs-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "authority.json"), "{}");
  await writeFile(join(root, "specs", "index.json"), JSON.stringify({ path: "./authority.json" }));
  await writeFile(join(root, "README.md"), "[Authority](specs/authority.json)");
  await expect(run({ root })).resolves.toEqual({ ruleId: "A-1.100.3", status: "pass", message: "" });
  await writeFile(join(root, "README.md"), "[Missing](specs/missing.json)");
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail", message: expect.stringContaining("missing.json") }));
  await rm(root, { recursive: true, force: true });
});
