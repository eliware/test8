import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/web/A-1.50.3.mjs";

const topics = [
  "purpose",
  "requirements",
  "setup",
  "configuration",
  "routes",
  "assets",
  "ports",
  "usage",
  "browser",
  "operations",
  "security",
  "support",
  "license",
];

test("accepts a web README covering all required topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-readme-"));
  await writeFile(join(root, "README.md"), topics.join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.3",
    status: "pass",
  });
});

test("reports missing web README topics", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-readme-"));
  await writeFile(join(root, "README.md"), topics.slice(0, 3).join("\n"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.3",
    status: "fail",
  });
});

test("rejects a missing web README", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-web-readme-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.50.3",
    status: "fail",
    message: "Web repositories require README.md.",
  });
});
