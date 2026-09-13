import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/npm-published/E-1.140/E-1.140.1.mjs";

test("requires the public package publication contract", () => {
  const packageJson = {
    engines: { node: ">=26" }, publishConfig: { provenance: true },
    files: ["README.md", "LICENSE", "RELEASE_NOTES.md", "docs/", "specs/"], scripts: { pack: "eliware-test --pack" },
  };
  expect(run({ packageJson }).status).toBe("pass");
  expect(run({ packageJson: { ...packageJson, scripts: { pack: "npm pack" } } }).status).toBe("fail");
});
