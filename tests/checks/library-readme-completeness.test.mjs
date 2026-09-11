import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/library/A-1.40.3.mjs";

const topics = [
  "purpose",
  "requirements",
  "setup",
  "configuration",
  "usage",
  "api",
  "validation",
  "packaging",
  "security",
  "support",
  "license",
  "examples",
];

test("accepts a library README covering all required topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-readme-"));
  await writeFile(join(root, "README.md"), topics.join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.3",
    status: "pass",
  });
});

test("reports missing library README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-readme-"));
  await writeFile(join(root, "README.md"), topics.slice(0, 3).join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.3",
    status: "fail",
    message:
      "Library README.md is missing: configuration, usage, api, validation, packaging, security, support, license, examples.",
  });
});

test("rejects a missing library README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-readme-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.3",
    status: "fail",
    message: "Library repositories require README.md.",
  });
});
