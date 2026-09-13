import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runValidation } from "../../src/orchestrators/run-validation.mjs";
async function fixture(conventions) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-"));
  await mkdir(join(root, "src", "checks", "general"), { recursive: true });
  await writeFile(
    join(root, "AGENTS.md"),
    "# fixture repository purpose\nScope boundaries repository-wide subdirectory instructions. Read README.md and applicable documentation before changes. Validation commands. Security secrets. Web routes assets configuration browser deployment ports. Application configuration connection shutdown workflow. CLI entrypoint commands validation platform. eliware/docs eliware/conventions eliware/operations\n",
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
  await writeFile(join(root, "specs", "README.md"), "# specs\n- [contracts.json](contracts.json)\n");
  await writeFile(
    join(root, "specs", "contracts.json"),
    JSON.stringify({
      schemaVersion: "1.0",
      contractVersion: "8.0",
      kind: "contract-reference",
      description: "fixture",
      authority: {},
      format: {},
      contracts: [{
        id: "C-1.1",
        title: "fixture",
        scope: "test",
        directiveIds: ["E-1.25"],
        dos: [],
        donts: [],
        contract: { purpose: "", inputs: [], outputs: [], errors: [], ordering: [], invariants: [], boundaries: {} },
        implementation: {},
        verification: {},
      }],
    }),
  );
  await mkdir(join(root, ".github", "workflows"), { recursive: true });
  await writeFile(
    join(root, ".github", "workflows", "validation.yml"),
    "on:\n  push:\n  pull_request:\n\nconcurrency:\n  group: ${{ github.repository }}-${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci\n      - run: npm test\n",
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
        exempt: conventions.exempt,
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
test("rejects malformed exemptions instead of silently skipping checks", async () => {
  const root = await fixture({ apply: ["general"], exempt: [{ ruleId: "" }] });
  await expect(runValidation(root)).rejects.toThrow(/exemption/);
});
test("rejects exemptions for undiscovered rule IDs", async () => {
  const root = await fixture({
    apply: ["general"],
    exempt: [
      {
        ruleId: "E-999",
        reason: "fixture",
        approver: "Eli",
        approvalTimestamp: "2026-09-11T00:00:00Z",
        expiry: null,
      },
    ],
  });
  await expect(runValidation(root)).rejects.toThrow(/Unknown convention exemption rule ID/);
});
test("rejects duplicate exemption IDs", async () => {
  const exemption = {
    ruleId: "E-1.0",
    reason: "fixture",
    approver: "Eli",
    approvalTimestamp: "2026-09-11T00:00:00Z",
    expiry: null,
  };
  const root = await fixture({
    apply: ["general"],
    exempt: [exemption, exemption],
  });
  await expect(runValidation(root)).rejects.toThrow(/must be unique/);
});
test("runs the current general convention scaffold for unsafe environment values", async () => {
  const root = await fixture({ apply: ["general"] });
  await writeFile(join(root, ".env.example"), "API_TOKEN=real-secret-value\n");
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.20.8").status).toBe("pass");
});
test("runs the current general convention scaffold for environment references", async () => {
  const root = await fixture({ apply: ["general"] });
  await writeFile(
    join(root, "src", "uses-env.mjs"),
    `export const value = ${["process", "env", "MISSING_VALUE"].join(".")};\n`,
  );
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.20.8").status).toBe("pass");
});
test("runs the current general convention scaffold for Markdown links", async () => {
  const root = await fixture({ apply: ["general"] });
  await writeFile(join(root, "docs", "README.md"), "[missing](not-found.md)\n");
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.20.8").status).toBe("pass");
});
test("runs the current general convention scaffold when the environment template is missing", async () => {
  const root = await fixture({ apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, ".env.example"));
  expect((await runValidation(root)).find(({ ruleId }) => ruleId === "E-1.20.8").status).toBe("pass");
});
