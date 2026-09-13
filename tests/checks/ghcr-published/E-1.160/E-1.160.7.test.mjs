import { expect, test } from "@jest/globals";
import { createGhcrFixture } from "../../../../test-fixtures/ghcr-workflow.mjs";
import { run } from "../../../../src/checks/ghcr-published/E-1.160/E-1.160.7.mjs";

test("requires digest identity and rejects latest", async () => {
  const { root, publicationPath } = await createGhcrFixture();
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "pass" }));
  const { readFile, writeFile } = await import("node:fs/promises");
  const content = await readFile(publicationPath, "utf8");
  await writeFile(publicationPath, content.replace("docker push ghcr.io/eliware/example:v1.2.3", "docker push ghcr.io/eliware/example:latest"));
  await expect(run({ root })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
});
