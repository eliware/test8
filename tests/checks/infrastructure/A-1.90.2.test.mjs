import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../src/checks/infrastructure/A-1.90.2.mjs";

test("validates configured infrastructure paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-infra-"));
  await expect(run({ root, packageJson: { eliware: {} } })).resolves.toMatchObject({
    status: "pass",
  });
  await expect(
    run({ root, packageJson: { eliware: { infrastructure: { requiredPaths: ["state.json"] } } } }),
  ).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, "state.json"), "{}\n");
  await expect(
    run({ root, packageJson: { eliware: { infrastructure: { requiredPaths: ["state.json"] } } } }),
  ).resolves.toMatchObject({ status: "pass" });
});
