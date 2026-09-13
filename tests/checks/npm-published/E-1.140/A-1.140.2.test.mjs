import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/npm-published/E-1.140/A-1.140.2.mjs";

test("validates publication workflow gates when present", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-publish-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "publish.yml"), "on: { push: { tags: ['v*.*.*'] } }\nruns-on: ubuntu-latest\nnpm pkg get version\nnpm publish\n");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, ".github", "workflows", "publish.yml"), "npm publish\n");
  expect((await run({ root })).status).toBe("fail");
});
