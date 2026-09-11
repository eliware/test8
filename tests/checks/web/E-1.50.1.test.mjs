import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/web/E-1.50.1.mjs";

test("accepts valid web metadata", () => {
  expect(
    run({ packageJson: { eliware: { webRoot: "dist", webAssetExcludes: ["robots.txt"] } } }).status,
  ).toBe("pass");
});

test("rejects invalid web metadata", () => {
  expect(run({ packageJson: { eliware: { webRoot: "" } } }).status).toBe("fail");
  expect(run({ packageJson: { eliware: { webAssetExcludes: [1] } } }).status).toBe("fail");
});
