import { expect, test } from "@jest/globals";
import { assertCheckResult } from "../../src/checks/check-result.mjs";
import { run } from "../../src/checks/node/E-1.20.2.mjs";
import { run as runWeb } from "../../src/checks/web/E-1.50.mjs";
import { run as runWebAgents } from "../../src/checks/web/A-1.50.0.mjs";
import { run as runWebAgentsDetail } from "../../src/checks/web/A-1.50.0.1.mjs";
import { run as runWebAssets } from "../../src/checks/web/E-1.50.1.mjs";
import { run as runWebReadme } from "../../src/checks/web/A-1.50.3.mjs";
import { run as runLibrary } from "../../src/checks/library/E-1.40.mjs";
import { run as runDocumentation } from "../../src/checks/documentation/E-1.100.mjs";
import { run as runDiscord } from "../../src/checks/discord/E-1.70.mjs";
import { run as runMcp } from "../../src/checks/mcp-server/E-1.80.mjs";
import { run as runInfrastructure } from "../../src/checks/infrastructure/E-1.90.mjs";
import { run as runWorkspace } from "../../src/checks/workspace/E-1.110.mjs";
import { run as runLibraryAgents } from "../../src/checks/library/A-1.40.0.mjs";
import { run as runLibraryAgentsDetail } from "../../src/checks/library/A-1.40.0.1.mjs";
import { run as runLibraryExamples } from "../../src/checks/library/A-1.40.1.mjs";
import { run as runLibraryReadme } from "../../src/checks/library/A-1.40.3.mjs";
import { run as runLibraryPackage } from "../../src/checks/library/A-1.40.5.mjs";
import { run as runLibraryPack } from "../../src/checks/library/E-1.40.2.mjs";
import { run as runLibraryContents } from "../../src/checks/library/E-1.40.4.mjs";

test("passes when package.json declares native ESM", () => {
  expect(run({ packageJson: { type: "module" } })).toEqual({
    ruleId: "E-1.20.2",
    status: "pass",
    message: "",
  });
});

test("fails when package.json does not declare native ESM", () => {
  const result = run({ packageJson: { type: "commonjs" } });
  expect(result.status).toBe("fail");
  expect(result.message).toMatch(/type.*module/);
});

test("rejects a check result with the wrong rule identity", () => {
  expect(() => assertCheckResult({ ruleId: "wrong", status: "pass" }, "E-1.20.2")).toThrow(
    /invalid result/,
  );
});

test.each([
  ["web", runWeb],
  ["discord", runDiscord],
  ["mcp", runMcp],
])("requires application conventions for %s", (_name, check) => {
  expect(
    check({ packageJson: { eliware: { conventions: { apply: ["application"] } } } }).status,
  ).toBe("pass");
  expect(check({ packageJson: { eliware: { conventions: { apply: [] } } } }).status).toBe("fail");
});

test("requires node conventions for libraries", () => {
  expect(
    runLibrary({ packageJson: { eliware: { conventions: { apply: ["node"] } } } }).status,
  ).toBe("pass");
  expect(runLibrary({ packageJson: { eliware: { conventions: { apply: [] } } } }).status).toBe(
    "fail",
  );
});

test.each([
  [runDocumentation, "E-1.100"],
  [runInfrastructure, "E-1.90"],
  [runWorkspace, "E-1.110"],
])("accepts a repository root for %s", (check, ruleId) => {
  expect(check({ root: "C:/repo" })).toEqual({ ruleId, status: "pass", message: "" });
  expect(check({ root: "" }).status).toBe("fail");
});

test("validates web metadata and documentation", async () => {
  const root = process.cwd();
  expect(
    runWebAssets({ packageJson: { eliware: { webRoot: "public", webAssetExcludes: ["dist"] } } })
      .status,
  ).toBe("pass");
  expect(runWebAssets({ packageJson: { eliware: { webRoot: "" } } }).status).toBe("fail");
  expect((await runWebAgents({ root })).status).toBe("pass");
  expect((await runWebAgentsDetail({ root })).status).toBe("pass");
  expect((await runWebReadme({ root })).status).toBe("pass");
  expect((await runLibraryAgents({ root })).status).toBe("pass");
  expect((await runLibraryAgentsDetail({ root })).status).toBe("pass");
  expect((await runLibraryExamples({ root, packageJson: { name: "@eliware/test" } })).status).toBe(
    "fail",
  );
  expect((await runLibraryReadme({ root })).status).toBe("pass");
  expect(runLibraryPackage({ packageJson: { main: "index.mjs", files: ["src"] } }).status).toBe(
    "pass",
  );
  expect(runLibraryPack({ packageJson: { scripts: { pack: "npm pack --dry-run" } } }).status).toBe(
    "pass",
  );
  expect(
    runLibraryContents({ packageJson: { scripts: { pack: "npm pack --dry-run" } } }).status,
  ).toBe("pass");
});
