import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/general/E-1.10.mjs";

test("requires Knit validation and deployment files", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-knit-"));
  await expect(run({ root })).resolves.toMatchObject({ status: "fail" });
  await mkdir(join(root, ".knit"));
  await writeFile(join(root, ".knit", "validate.mjs"), "export default {};\n");
  await writeFile(join(root, ".knit", "deploy.yaml"), "version: 1\n");
  await expect(run({ root })).resolves.toMatchObject({ status: "pass" });
});
