import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@jest/globals";
import { runValidation } from "../../src/orchestrators/run-validation.mjs";
import { validateExemptionRecords } from "../../src/orchestrators/validate-exemption-records.mjs";
import { discoverChecks } from "../../src/orchestrators/discover-checks.mjs";
async function fixture(conventions) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-"));
  await mkdir(join(root, "src", "checks", "general"), { recursive: true });
  await writeFile(join(root, "AGENTS.md"), "# fixture\n");
  await writeFile(join(root, "README.md"), "# fixture\n");
  await writeFile(join(root, "RELEASE_NOTES.md"), "# Release notes\n");
  await writeFile(join(root, ".env.example"), "# safe example\n");
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(join(root, "docs", "README.md"), "# docs\n");
  await mkdir(join(root, "examples"), { recursive: true });
  await writeFile(join(root, "examples", "README.md"), "# examples\n");
  await mkdir(join(root, "specs"), { recursive: true });
  await writeFile(join(root, "specs", "README.md"), "# specs\n");
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "fixture",
      version: "1.0.0",
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
      eliware: { conventions },
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
  const root = await fixture({ version: "8.0", apply: ["general"] });
  const results = await runValidation(root);
  expect(results.map(({ ruleId, status }) => ({ ruleId, status }))).toEqual([
    { ruleId: "E-1.0", status: "pass" },
    { ruleId: "E-1.1", status: "pass" },
    { ruleId: "E-1.2", status: "pass" },
    { ruleId: "E-1.3", status: "pass" },
    { ruleId: "E-1.9", status: "pass" },
    { ruleId: "E-1.9.0", status: "pass" },
    { ruleId: "E-1.19", status: "pass" },
    { ruleId: "A-1.25.0", status: "pass" },
    { ruleId: "E-1.26", status: "pass" },
    { ruleId: "A-18.5.0", status: "pass" },
    { ruleId: "A-18.5.2", status: "pass" },
    { ruleId: "A-18.6.0", status: "pass" },
    { ruleId: "A-18.6.1", status: "pass" },
  ]);
});
test("rejects impossible exemption approval dates", async () => {
  const root = await fixture({
    version: "8.0",
    apply: ["general"],
    exemptions: [
      { ruleId: "E-1.0", reason: "fixture", approver: "Eli", approvalDate: "2026-02-31" },
    ],
  });
  await expect(runValidation(root)).rejects.toThrow(/Every exemption/);
});

test("rejects exemption dates that do not use the required format", () => {
  expect(() =>
    validateExemptionRecords([
      { ruleId: "E-1.0", reason: "fixture", approver: "Eli", approvalDate: "2026-9-11" },
    ]),
  ).toThrow(/Every exemption/);
});
test("fails when the required root README is missing", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "README.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.1").status).toBe("fail");
});
test("runs an explicitly applied cli group", async () => {
  const root = await fixture({ version: "8.0", apply: ["application", "cli"] });
  const results = await runValidation(root);
  expect(results.map(({ ruleId }) => ruleId)).toContain("A-18.0.0");
});
test("fails when the specification index is missing", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "specs", "README.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.2").status).toBe("fail");
});
test("fails when required package identity metadata is missing", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
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
  const root = await fixture({ version: "8.0", apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, "RELEASE_NOTES.md"));
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "E-1.26").status).toBe("fail");
});
test("skips only an exact exempted check ID", async () => {
  const root = await fixture({
    version: "8.0",
    apply: ["general"],
    exemptions: [
      { ruleId: "E-1.0", reason: "fixture", approver: "Eli", approvalDate: "2026-09-11" },
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
test("rejects malformed exemptions instead of silently skipping checks", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"], exemptions: [{ ruleId: "" }] });
  await expect(runValidation(root)).rejects.toThrow(/exemption/);
});
test("rejects exemptions for undiscovered rule IDs", async () => {
  const root = await fixture({
    version: "8.0",
    apply: ["general"],
    exemptions: [
      { ruleId: "E-999", reason: "fixture", approver: "Eli", approvalDate: "2026-09-11" },
    ],
  });
  await expect(runValidation(root)).rejects.toThrow(/Unknown convention exemption rule ID/);
});
test("rejects duplicate exemption IDs", async () => {
  const exemption = {
    ruleId: "E-1.0",
    reason: "fixture",
    approver: "Eli",
    approvalDate: "2026-09-11",
  };
  const root = await fixture({
    version: "8.0",
    apply: ["general"],
    exemptions: [exemption, exemption],
  });
  await expect(runValidation(root)).rejects.toThrow(/must be unique/);
});
test("fails unsafe environment example values", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  await writeFile(join(root, ".env.example"), "API_TOKEN=real-secret-value\n");
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "A-18.5.0").status).toBe("fail");
});
test("fails undocumented source environment references", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  await writeFile(
    join(root, "src", "uses-env.mjs"),
    "export const value = process.env.MISSING_VALUE;\n",
  );
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "A-18.5.0").status).toBe("fail");
});
test("fails broken local Markdown links", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  await writeFile(join(root, "docs", "README.md"), "[missing](not-found.md)\n");
  const results = await runValidation(root);
  expect(results.find(({ ruleId }) => ruleId === "A-18.5.0").status).toBe("fail");
});
test("reports a missing environment template", async () => {
  const root = await fixture({ version: "8.0", apply: ["general"] });
  const { rm } = await import("node:fs/promises");
  await rm(join(root, ".env.example"));
  expect((await runValidation(root)).find(({ ruleId }) => ruleId === "A-18.5.0").message).toMatch(
    /\.env\.example/,
  );
});
