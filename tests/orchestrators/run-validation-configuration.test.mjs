import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runValidation } from "../../src/orchestrators/run-validation.mjs";
import { discoverChecks } from "../../src/orchestrators/discover-checks.mjs";
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
      name: "fixture",
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
        conventions: { version: conventions.version, apply: conventions.apply },
        exempt: conventions.exempt,
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
test("skips only an exact exempted check ID", async () => {
  const root = await fixture({
    version: "8.0",
    apply: ["general"],
    exempt: [
      { ruleId: "E-1.0", reason: "fixture", approver: "Eli", expiry: null, review: "fixture" },
    ],
  });
  const results = await runValidation(root);
  expect(results.some(({ ruleId }) => ruleId === "E-1.0")).toBe(false);
  expect(results.some(({ ruleId }) => ruleId === "E-1.9")).toBe(true);
});
test("rejects unsupported convention configuration", async () => {
  const root = await fixture({ version: "7.0", apply: ["general"] });
  await expect(runValidation(root)).rejects.toThrow(/version must be 8\.0/);
});

test("rejects the removed node convention group", async () => {
  const root = await fixture({ version: "8.0", apply: ["general", "node"] });
  await expect(runValidation(root)).rejects.toThrow(/Unknown convention group: node/);
});

test("rejects unknown convention groups during discovery", async () => {
  await expect(
    discoverChecks(["missing"], {
      readDirectory: async () => {
        throw new Error("missing");
      },
    }),
  ).rejects.toThrow(/Unknown convention group/);
});

test("rejects duplicate discovered check IDs", async () => {
  const entry = { name: "E-1.0.mjs", isFile: () => true };
  await expect(
    discoverChecks(["general"], {
      root: "C:/checks",
      readDirectory: async () => [entry, entry],
      importCheck: async () => ({ ruleId: "E-1.0", run: () => ({}) }),
    }),
  ).rejects.toThrow(/Duplicate check module/);
});

test("sorts discovered checks by numeric rule components", async () => {
  const entries = [
    { name: "E-1.10.mjs", isFile: () => true },
    { name: "E-1.2.mjs", isFile: () => true },
    { name: "E-1.mjs", isFile: () => true },
    { name: "E-1.0.mjs", isFile: () => true },
  ];
  const discovered = await discoverChecks(["general"], {
    root: "C:/checks",
    readDirectory: async () => entries,
    importCheck: async (url) => ({
      ruleId: url.href.match(/E-\d+(?:\.\d+)*/)[0],
      run: () => ({}),
    }),
  });
  expect(discovered.map(({ ruleId }) => ruleId)).toEqual(["E-1", "E-1.0", "E-1.2", "E-1.10"]);
});

test("rejects discovered modules with invalid exports", async () => {
  const entry = { name: "E-1.0.mjs", isFile: () => true };
  await expect(
    discoverChecks(["general"], {
      root: "C:/checks",
      readDirectory: async () => [entry],
      importCheck: async () => ({ ruleId: "wrong", run: null }),
    }),
  ).rejects.toThrow(/Invalid check module/);
});
