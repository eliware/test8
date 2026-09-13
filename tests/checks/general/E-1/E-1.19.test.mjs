import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/general/E-1/E-1.19.mjs";

const valid = {
  name: "@eliware/fixture",
  version: "8.0.0",
  description: "fixture",
  keywords: ["fixture"],
  author: "Eliware",
  license: "MIT",
  repository: { url: "https://github.com/eliware/fixture" },
  engines: { node: ">=26" },
  jest: {},
};

test("accepts the required scoped package metadata", () => {
  expect(run({ packageJson: valid })).toEqual({ ruleId: "E-1.19", status: "pass", message: "" });
});

test("rejects an unscoped package or missing runtime metadata", () => {
  expect(run({ packageJson: { ...valid, name: "fixture" } })).toEqual(expect.objectContaining({ status: "fail" }));
  expect(run({ packageJson: { ...valid, engines: { node: ">=20" } } })).toEqual(expect.objectContaining({ status: "fail" }));
});
