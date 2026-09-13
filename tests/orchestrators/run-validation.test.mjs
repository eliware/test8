import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runValidation } from "../../src/orchestrators/run-validation.mjs";
import { validateExemptionRecords } from "../../src/orchestrators/validate-exemption-records.mjs";
async function fixture(conventions) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-"));
  await mkdir(join(root, "src", "checks", "general"), { recursive: true });
  await writeFile(
    join(root, "AGENTS.md"),
    "# fixture repository purpose\nScope boundaries repository-wide subdirectory instructions. Read README.md and applicable documentation before changes. Validation commands. Security secrets. Web routes assets configuration browser deployment ports. Application configuration connection shutdown workflow. CLI entrypoint commands validation platform.\n",
  );
  await writeFile(join(root, "README.md"), "# fixture\n");
  await writeFile(join(root, "RELEASE_NOTES.md"), "# Release notes\n## 1.0.0\n");
  await writeFile(join(root, "LICENSE"), "MIT License\nCopyright (c) 2026 Eliware\n");
  await writeFile(join(root, ".env.example"), "# safe example\n");
  await writeFile(
    join(root, ".gitignore"),
    "node_modules\n.git\ncoverage\nbuild\n.env\nbackup\ndump\nrestore\nruntime state\n",
  );
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(join(root, "docs", "README.md"), "# docs\n");
  await mkdir(join(root, "examples"), { recursive: true });
  await writeFile(join(root, "examples", "README.md"), "# examples\n");
  await mkdir(join(root, "specs"), { recursive: true });
  await writeFile(join(root, "specs", "README.md"), "# specs\n");
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(
    join(root, ".github", "workflows", "validation.yml"),
    "on:\n  push:\n  pull_request:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci\n      - run: npm test\n",
  );
  await mkdir(join(root, ".knit"), { recursive: true });
  await writeFile(join(root, ".knit", "validate.mjs"), "export default {};\n");
  await writeFile(join(root, ".knit", "deploy.yaml"), "version: 1\n");
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "@eliware/fixture",
      version: "8.0.0",
      description: "fixture",
      author: "Eliware <eliware@eliware.org>",
      keywords: ["fixture"],
      license: "MIT",
      bin: { "eliware-test": "./bin/eliware-test.mjs" },
      files: [
        "bin",
        "src",
        "specs",
        "docs",
        "examples",
        "README.md",
        "LICENSE",
        "RELEASE_NOTES.md",
      ],
      publishConfig: { access: "public" },
      repository: { type: "git", url: "https://github.com/eliware/fixture" },
      homepage: "https://github.com/eliware/fixture#readme",
      type: "module",
      engines: { node: ">=26" },
      dependencies: { jest: "^30.0.0", oxlint: "^1.0.0", prettier: "^3.0.0" },
      scripts: { test: "eliware-test", lint: "eliware-test --lint" },
      eliware: {
        apply: conventions.apply,
        exempt: conventions.exempt ?? [],
        authority: {
          authoritativeFor: ["fixture"],
          notAuthoritativeFor: ["runtime"],
        },
        crosslinks: [
          {
            path: "../docs/authority-map.json",
            relation: "relatedAuthority",
            authoritativeFor: "fixture",
          },
        ],
      },
    }),
  );
  await writeFile(
    join(root, "package-lock.json"),
    JSON.stringify({
      name: "fixture",
      version: "1.0.0",
      lockfileVersion: 3,
      packages: {},
    }),
  );
  return root;
}
test("runs general checks and returns pass/fail results with exact rule IDs", async () => {
  const root = await fixture({ apply: ["general"] });
  const results = await runValidation(root);
  expect(results.map(({ ruleId, status }) => ({ ruleId, status }))).toEqual(
    expect.arrayContaining([
      { ruleId: "E-1.0", status: "pass" },
      { ruleId: "A-1.0.0", status: "pass" },
      { ruleId: "A-1.0.1", status: "pass" },
      { ruleId: "A-1.0.2", status: "pass" },
      { ruleId: "A-1.0.3", status: "pass" },
      { ruleId: "A-1.0.4", status: "pass" },
      { ruleId: "A-1.0.6", status: "pass" },
      { ruleId: "A-1.0.7", status: "pass" },
      { ruleId: "A-1.0.8", status: "pass" },
      { ruleId: "A-1.0.9", status: "pass" },
      { ruleId: "A-1.0.10", status: "pass" },
      { ruleId: "A-1.0.11", status: "pass" },
      { ruleId: "E-1.1", status: "pass" },
      { ruleId: "E-1.2", status: "pass" },
      { ruleId: "E-1.3", status: "pass" },
      { ruleId: "E-1.9", status: "pass" },
      { ruleId: "E-1.9.0", status: "pass" },
      { ruleId: "E-1.9.5", status: "pass" },
      { ruleId: "A-1.9.6", status: "pass" },
      { ruleId: "E-1.10", status: "pass" },
      { ruleId: "E-1.14", status: "pass" },
      { ruleId: "E-1.16", status: "pass" },
      { ruleId: "E-1.19", status: "pass" },
      { ruleId: "A-1.22.1", status: "pass" },
      { ruleId: "E-1.23", status: "pass" },
      { ruleId: "E-1.24", status: "pass" },
      { ruleId: "A-1.24.0", status: "pass" },
      { ruleId: "A-1.24.1", status: "pass" },
      { ruleId: "A-1.24.2", status: "pass" },
      { ruleId: "A-1.24.3", status: "pass" },
      { ruleId: "A-1.24.4", status: "pass" },
      { ruleId: "A-1.25.0", status: "pass" },
      { ruleId: "E-1.26", status: "pass" },
      { ruleId: "A-1.26.0", status: "fail" },
      { ruleId: "A-18.5.0", status: "pass" },
      { ruleId: "A-18.5.2", status: "pass" },
      { ruleId: "A-18.6.0", status: "pass" },
      { ruleId: "A-18.6.1", status: "fail" },
    ]),
  );
  expect(results.every(({ status }) => ["pass", "fail"].includes(status))).toBe(true);
});
test("rejects impossible exemption approval dates", async () => {
  const root = await fixture({
    apply: ["general"],
    exempt: [
      {
        ruleId: "E-1.0",
        reason: "fixture",
        approver: "Eli",
        approvalTimestamp: "2026-09-11T00:00:00Z",
        expiry: "2026-02-31",
      },
    ],
  });
  await expect(runValidation(root)).rejects.toThrow(/Every exemption/);
});
test("rejects exemption dates that do not use the required format", () => {
  expect(() =>
    validateExemptionRecords([
      {
        ruleId: "E-1.0",
        reason: "fixture",
        approver: "Eli",
        expiry: "2026-9-11",
        review: "fixture",
      },
    ]),
  ).toThrow(/Every exemption/);
});
test("fails when the required root README is missing", async () => {
  const root = await fixture({ apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "README.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.1").status).toBe("fail");
});
test("runs an explicitly applied cli group", async () => {
  const root = await fixture({ apply: ["application", "cli"] });
  const results = await runValidation(root);
  expect(results.map(({ ruleId }) => ruleId)).toContain("A-18.0.0");
});
test("fails when the specification index is missing", async () => {
  const root = await fixture({ apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "specs", "README.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.2").status).toBe("fail");
});
test("fails when required package identity metadata is missing", async () => {
  const root = await fixture({ apply: ["general"] });
  const packageJson = JSON.parse(
    await (await import("node:fs/promises")).readFile(join(root, "package.json"), "utf8"),
  );
  delete packageJson.name;
  await (
    await import("node:fs/promises")
  ).writeFile(join(root, "package.json"), JSON.stringify(packageJson));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.19").status).toBe("fail");
});
test("fails when release notes are missing", async () => {
  const root = await fixture({ apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "RELEASE_NOTES.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.26").status).toBe("fail");
});
