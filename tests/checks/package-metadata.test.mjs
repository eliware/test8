import { expect, test } from "@jest/globals";
import { run as runTestScript } from "../../src/checks/general/E-1.3.mjs";
import { run as runConventionsPresence } from "../../src/checks/general/E-1.9.mjs";
import { run as runConventionConfig } from "../../src/checks/general/E-1.9.0.mjs";
import { run as runExemptions } from "../../src/checks/general/E-1.9.3.mjs";
import { run as runCliScript } from "../../src/checks/cli/A-18.0.0.mjs";

const _validScripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

const _validReleasePackage = {
  name: "fixture",
  version: "1.0.0",
  author: "Eliware",
  keywords: ["fixture"],
  repository: "https://github.com/eliware/fixture",
  bugs: "https://github.com/eliware/fixture/issues",
  homepage: "https://github.com/eliware/fixture",
  publishConfig: { access: "public" },
  license: "MIT",
  type: "module",
  engines: { node: ">=26" },
  bin: { "eliware-test": "./bin/eliware-test.mjs" },
  files: ["bin", "src", "specs", "docs", "examples", "README.md", "LICENSE", "RELEASE_NOTES.md"],
  dependencies: { jest: "^30", oxlint: "^1", prettier: "^3" },
};

test("accepts a test script that invokes eliware-test", () => {
  expect(runTestScript({ packageJson: { scripts: { test: "eliware-test" } } })).toEqual({
    ruleId: "E-1.3",
    status: "pass",
    message: "",
  });
});

test("rejects missing or empty test scripts", () => {
  expect(runTestScript({ packageJson: {} }).message).toMatch(/non-empty string/);
  expect(runTestScript({ packageJson: { scripts: { test: " " } } }).message).toMatch(
    /non-empty string/,
  );
});

test("rejects test scripts that omit eliware-test", () => {
  expect(runTestScript({ packageJson: { scripts: { test: "jest" } } }).message).toMatch(
    /invoke eliware-test/,
  );
});

test("accepts valid v8 convention configuration", () => {
  expect(
    runConventionConfig({
      packageJson: { eliware: { conventions: { version: "8.0", apply: ["general"] } } },
    }),
  ).toEqual({ ruleId: "E-1.9.0", status: "pass", message: "" });
});

test("rejects missing or unsupported convention versions", () => {
  expect(runConventionConfig({ packageJson: {} }).message).toMatch(/version must be 8\.0/);
  expect(
    runConventionConfig({
      packageJson: { eliware: { conventions: { version: "7.0", apply: ["general"] } } },
    }).message,
  ).toMatch(/version must be 8\.0/);
});

test("rejects malformed convention groups and exemptions", () => {
  expect(
    runConventionConfig({
      packageJson: { eliware: { conventions: { version: "8.0", apply: ["general", 1] } } },
    }).message,
  ).toMatch(/apply must be an array/);
  expect(
    runConventionConfig({
      packageJson: { eliware: { conventions: { version: "8.0", apply: [], exemptions: {} } } },
    }).message,
  ).toMatch(/exemptions must be an array/);
});

test("requires complete exemption records", () => {
  expect(runExemptions({ packageJson: {} })).toMatchObject({ status: "pass" });
  expect(
    runExemptions({
      packageJson: {
        eliware: {
          conventions: {
            exemptions: [{ ruleId: "E-1", reason: "r", approver: "a", approvalDate: "2026-01-01" }],
          },
        },
      },
    }),
  ).toMatchObject({ status: "pass" });
  expect(
    runExemptions({
      packageJson: { eliware: { conventions: { exemptions: [{ ruleId: "E-1" }] } } },
    }),
  ).toMatchObject({ status: "fail" });
  expect(
    runExemptions({ packageJson: { eliware: { conventions: { exemptions: {} } } } }),
  ).toMatchObject({ status: "fail" });
});

test("requires conventions to be a non-array object", () => {
  expect(runConventionsPresence({ packageJson: {} }).message).toMatch(
    /must define eliware\.conventions/,
  );
  expect(runConventionsPresence({ packageJson: { eliware: { conventions: null } } }).status).toBe(
    "fail",
  );
  expect(runConventionsPresence({ packageJson: { eliware: { conventions: [] } } }).status).toBe(
    "fail",
  );
  expect(
    runConventionsPresence({ packageJson: { eliware: { conventions: { version: "8.0" } } } }),
  ).toEqual({ ruleId: "E-1.9", status: "pass", message: "" });
});

test("accepts lint scripts that invoke eliware-test --lint", () => {
  expect(
    runCliScript({ packageJson: { scripts: { lint: "  eliware-test --lint --quiet" } } }),
  ).toEqual({ ruleId: "A-18.0.0", status: "pass", message: "" });
});

test("rejects missing, malformed, or unrelated lint scripts", () => {
  expect(runCliScript({ packageJson: {} }).status).toBe("fail");
  expect(runCliScript({ packageJson: { scripts: { lint: 1 } } }).status).toBe("fail");
  expect(runCliScript({ packageJson: { scripts: { lint: "npm run lint" } } }).status).toBe("fail");
});
