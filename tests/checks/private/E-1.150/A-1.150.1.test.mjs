import { expect, test } from "@jest/globals";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../../../../src/checks/private/E-1.150/A-1.150.1.mjs";

test("rejects publication and deployment from private CI", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-private-"));
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: npm test");
  expect((await run({ root })).status).toBe("pass");
  await writeFile(join(root, ".github", "workflows", "ci.yml"), "run: npm publish");
  expect((await run({ root })).status).toBe("fail");
});
