import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run as runCoveragePolicy } from "../../src/checks/general/E-1.5.mjs";
import { run as runGitignore } from "../../src/checks/general/E-1.6.mjs";
import { run as runGitignoreRuntime } from "../../src/checks/general/E-1.6.0.mjs";
import { run as runForbiddenFiles } from "../../src/checks/general/E-1.6.1.mjs";
import { run as runInfrastructureBoundary } from "../../src/checks/general/E-1.7.mjs";

const roots = [];
afterEach(async () =>
  Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))),
);

test("coverage policy passes clean source and ignores its own checker", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-policy-"));
  roots.push(root);
  await writeFile(join(root, "clean.mjs"), "export const value = 1;\n");
  await writeFile(join(root, "notes.txt"), ["service", ".internal\n"].join(""));
  await mkdir(join(root, "node_modules", "fixture"), { recursive: true });
  await writeFile(
    join(root, "node_modules", "fixture", "bad.mjs"),
    ["service", ".internal\n"].join(""),
  );
  await writeFile(join(root, "E-1.5.mjs"), ["istanbul", " ignore next\n"].join(""));
  await expect(runCoveragePolicy({ root })).resolves.toEqual({
    ruleId: "E-1.5",
    status: "pass",
    message: "",
  });
});

test("coverage policy rejects ignore directives and reports discovery errors", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-coverage-policy-"));
  roots.push(root);
  await writeFile(
    join(root, "bad.mjs"),
    ["/* istanbul", " ignore next */\nexport const value = 1;\n"].join(""),
  );
  await expect(runCoveragePolicy({ root })).resolves.toMatchObject({
    ruleId: "E-1.5",
    status: "fail",
  });
  const file = join(root, "not-a-directory");
  await writeFile(file, "content");
  await expect(runCoveragePolicy({ root: file })).resolves.toMatchObject({
    ruleId: "E-1.5",
    status: "fail",
  });
});

test("gitignore requirements cover required, missing, and incomplete rules", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-ignore-"));
  roots.push(root);
  await expect(runGitignore({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".gitignore"), ".env\nnode_modules\n");
  await expect(runGitignore({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, ".gitignore"), ".env\n");
  await expect(runGitignore({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".gitignore"), ".env\nnode_modules\n");
  await expect(runGitignoreRuntime({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".gitignore"), ".env\nnode_modules\nruntime state\n");
  await expect(runGitignoreRuntime({ root })).resolves.toMatchObject({ status: "pass" });
  await expect(runForbiddenFiles({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "database.dump"), "data");
  await expect(runForbiddenFiles({ root })).resolves.toMatchObject({ status: "fail" });
  await expect(runForbiddenFiles({ root: join(root, "missing") })).resolves.toMatchObject({
    status: "pass",
  });
  await expect(runGitignore({ root: join(root, "database.dump") })).resolves.toMatchObject({
    status: "fail",
  });
  await expect(runGitignoreRuntime({ root: join(root, "database.dump") })).resolves.toMatchObject({
    status: "fail",
  });
  await expect(runForbiddenFiles({ root: join(root, "database.dump") })).resolves.toMatchObject({
    status: "fail",
  });
});

test("infrastructure boundary rejects internal identifiers and handles unreadable roots", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-boundary-"));
  roots.push(root);
  await writeFile(join(root, "clean.mjs"), "export const value = 1;\n");
  await expect(runInfrastructureBoundary({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, "internal.mjs"), ["const host = 'service", ".internal';\n"].join(""));
  await expect(runInfrastructureBoundary({ root })).resolves.toMatchObject({ status: "fail" });
  await expect(
    runInfrastructureBoundary({ root, files: [join(root, "node_modules", "fixture", "bad.mjs")] }),
  ).resolves.toMatchObject({ status: "pass" });
  await expect(runInfrastructureBoundary({ root: join(root, "internal.mjs") })).rejects.toThrow();
});
