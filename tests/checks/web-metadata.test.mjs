import { expect, test } from "@jest/globals";
import { run } from "../../src/checks/web/E-1.50.1.mjs";

test.each([
  {},
  { packageJson: {} },
  { packageJson: { eliware: {} } },
  { packageJson: { eliware: { webRoot: "public", webAssetExcludes: ["*.map"] } } },
])("accepts valid web metadata: %j", (input) => {
  expect(run(input)).toEqual({ ruleId: "E-1.50.1", status: "pass", message: "" });
});

test.each([
  { packageJson: { eliware: { webRoot: 42 } }, message: "webRoot" },
  { packageJson: { eliware: { webRoot: "   " } }, message: "webRoot" },
  { packageJson: { eliware: { webAssetExcludes: "*.map" } }, message: "webAssetExcludes" },
  { packageJson: { eliware: { webAssetExcludes: ["*.map", 42] } }, message: "only strings" },
])("rejects invalid web metadata: %j", ({ packageJson, message }) => {
  expect(run({ packageJson })).toMatchObject({
    ruleId: "E-1.50.1",
    status: "fail",
    message: expect.stringContaining(message),
  });
});
