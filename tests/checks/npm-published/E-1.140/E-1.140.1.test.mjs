import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/npm-published/E-1.140/E-1.140.1.mjs";

test("requires the public package publication contract", async () => {
  const packageJson = {
    engines: { node: ">=26" }, publishConfig: { provenance: true },
    files: ["README.md", "LICENSE", "RELEASE_NOTES.md", "docs/", "specs/"], scripts: { pack: "eliware-test --pack" },
  };
  await expect(run({ packageJson })).resolves.toEqual({ ruleId: "E-1.140.1", status: "pass", message: "" });
  await expect(run({ packageJson: { ...packageJson, scripts: { pack: "npm pack" } } })).resolves.toEqual(expect.objectContaining({ status: "fail" }));
});

test("reports pack diagnostics when the pack stage fails", async () => {
  const packageJson = {
    engines: { node: ">=26" }, publishConfig: { provenance: true },
    files: ["README.md", "LICENSE", "RELEASE_NOTES.md", "docs/", "specs/"], scripts: { pack: "eliware-test --pack" },
  };
  await expect(run({ packageJson, root: "C:\\repo", executePack: true, mode: "pack", runPack: async () => ({ code: 1, stdout: "pack findings", stderr: "" }) })).resolves.toEqual({
    ruleId: "E-1.140.1", status: "fail", message: "npm pack failed: pack findings",
  });
});
