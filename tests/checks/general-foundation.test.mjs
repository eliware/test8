import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { run as runGitignore } from "../../src/checks/general/A-1.22.1.mjs";
import { run as runHierarchy } from "../../src/checks/general/A-1.22.0.mjs";
import { run as runHarness } from "../../src/checks/general/A-1.3.0.mjs";

test("enforces the complete gitignore baseline", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await writeFile(
    join(root, ".gitignore"),
    "node_modules/\n.git/\ncoverage/\nbuild/\n.env\nruntime-state\n",
  );
  await expect(runGitignore({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.1",
    status: "pass",
  });
});

test("rejects incomplete gitignore policy", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-gitignore-"));
  await writeFile(join(root, ".gitignore"), "node_modules/\n");
  await expect(runGitignore({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.1",
    status: "fail",
  });
});

test("rejects malformed directive hierarchy", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-directives-"));
  await mkdir(join(root, "specs"), { recursive: true });
  await writeFile(
    join(root, "specs", "directives.json"),
    JSON.stringify({ directives: [{ id: "A-1" }] }),
  );
  await expect(runHierarchy({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.0",
    status: "fail",
  });
});

async function directiveRepository(directives, authorityMap) {
  const base = await mkdtemp(join(tmpdir(), "eliware-test8-directive-repo-"));
  const root = join(base, "repo");
  await mkdir(join(root, "specs"), { recursive: true });
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ repository: { url: "https://github.com/eliware/repo" } }),
  );
  await writeFile(join(root, "specs", "directives.json"), JSON.stringify({ directives }));
  if (authorityMap) {
    await mkdir(join(base, "docs"), { recursive: true });
    await writeFile(join(base, "docs", "authority-map.json"), JSON.stringify(authorityMap));
  }
  return root;
}

test.each([
  { directives: [{ id: "bad" }] },
  { directives: [{ id: "E-1", directives: [{ id: "A-2.1" }] }] },
  { directives: [{ id: "E-1", directives: [{ id: "A-1.1", directives: [{ id: "E-1.1.1" }] }] }] },
])("rejects invalid directive relationships: %j", async ({ directives }) => {
  const root = await directiveRepository(directives);
  await expect(runHierarchy({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.0",
    status: "fail",
  });
});

test("rejects a duplicate directive ID and malformed directives collection", async () => {
  const duplicateRoot = await directiveRepository([{ id: "E-1" }, { id: "E-1" }]);
  await expect(runHierarchy({ root: duplicateRoot })).resolves.toMatchObject({ status: "fail" });

  const malformedRoot = await mkdtemp(join(tmpdir(), "eliware-test8-directive-json-"));
  await mkdir(join(malformedRoot, "specs"));
  await writeFile(join(malformedRoot, "specs", "directives.json"), "not-json");
  await expect(runHierarchy({ root: malformedRoot })).resolves.toMatchObject({ status: "fail" });
});

test("accepts a valid E-rule with an A-rule child", async () => {
  const root = await directiveRepository([{ id: "E-1", directives: [{ id: "A-1.1" }] }]);
  await expect(runHierarchy({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.0",
    status: "pass",
  });
});

test("rejects a non-array child directives collection", async () => {
  const root = await directiveRepository([{ id: "E-1", directives: {} }]);
  await expect(runHierarchy({ root })).resolves.toMatchObject({ status: "fail" });
});

test("ignores JSON spec records without a directives array", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-directive-record-"));
  await mkdir(join(root, "specs"));
  await writeFile(join(root, "specs", "notes.json"), JSON.stringify({ metadata: true }));
  await expect(runHierarchy({ root })).resolves.toMatchObject({ status: "pass" });
});

test("accepts a matching namespace and ignores repositories without namespaces", async () => {
  const root = await directiveRepository([{ id: "E-1" }], {
    repositoryRegistry: [{ repository: "eliware/repo" }],
  });
  await expect(runHierarchy({ root })).resolves.toMatchObject({ status: "pass" });

  const namespacedRoot = await directiveRepository([{ id: "E-1" }], {
    repositoryRegistry: [{ repository: "eliware/repo", directiveNamespaces: ["E-1"] }],
  });
  await expect(runHierarchy({ root: namespacedRoot })).resolves.toMatchObject({ status: "pass" });
});

test("enforces a repository directive namespace when authority data declares one", async () => {
  const root = await directiveRepository([{ id: "E-99" }], {
    repositoryRegistry: [{ repository: "eliware/repo", directiveNamespaces: ["E-18"] }],
  });
  await expect(runHierarchy({ root })).resolves.toMatchObject({
    ruleId: "A-1.22.0",
    status: "fail",
  });
});

test("accepts the test package self-hosting command", () => {
  expect(
    runHarness({
      packageJson: { name: "@eliware/test", scripts: { test: "node bin/eliware-test.mjs" } },
    }),
  ).toMatchObject({ status: "pass" });
  expect(runHarness({ packageJson: { scripts: { test: "jest" } } })).toMatchObject({
    status: "fail",
  });
});
