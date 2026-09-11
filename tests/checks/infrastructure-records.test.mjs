import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run as runPaths } from "../../src/checks/infrastructure/A-1.90.2.mjs";
import { run as runSyntax } from "../../src/checks/infrastructure/A-1.90.3.mjs";

test("accepts declared infrastructure paths that exist", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-"));
  await writeFile(join(root, "manifest.json"), "{}\n");
  await expect(
    runPaths({
      root,
      packageJson: { eliware: { infrastructure: { requiredPaths: ["manifest.json"] } } },
    }),
  ).resolves.toMatchObject({ status: "pass" });
});

test("rejects missing or malformed infrastructure paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-"));
  await expect(
    runPaths({
      root,
      packageJson: { eliware: { infrastructure: { requiredPaths: ["missing.json"] } } },
    }),
  ).resolves.toMatchObject({ status: "fail" });
  await expect(
    runPaths({ root, packageJson: { eliware: { infrastructure: { requiredPaths: [1] } } } }),
  ).resolves.toMatchObject({ status: "fail" });
});

test("rejects malformed JSON infrastructure inputs", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-"));
  await writeFile(join(root, "manifest.json"), "not-json\n");
  await expect(runSyntax({ root })).resolves.toMatchObject({ status: "fail" });
});

test("accepts valid JSON and reports discovery errors", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-infra-"));
  await writeFile(join(root, "manifest.json"), "{}\n");
  await writeFile(join(root, "notes.txt"), "not JSON and ignored\n");
  await expect(runSyntax({ root })).resolves.toMatchObject({ status: "pass" });
  await expect(runSyntax({ root: join(root, "manifest.json") })).resolves.toMatchObject({
    status: "fail",
  });
});
