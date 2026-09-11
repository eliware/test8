import { run } from "../../../src/checks/general/E-1.20.17.mjs";

const scripts = {
  test: "eliware-test",
  lint: "eliware-test --lint",
  audit: "eliware-test --audit",
  format: "eliware-test --format",
  "format:check": "eliware-test --format-check",
};

test("requires the exact shared validation scripts", () => {
  expect(run({ packageJson: { scripts } })).toMatchObject({
    ruleId: "E-1.20.17",
    status: "pass",
  });
});

test("fails when a shared validation script is missing or direct", () => {
  expect(run({ packageJson: { scripts: { ...scripts, audit: "npm audit" } } })).toMatchObject({
    ruleId: "E-1.20.17",
    status: "fail",
  });
});
