import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.1.mjs";

test("accepts Node 26 declarations", () => {
  expect(run({ packageJson: { engines: { node: ">=26" } } }).status).toBe("pass");
});

test("rejects missing or older Node declarations", () => {
  expect(run({ packageJson: {} }).status).toBe("fail");
  expect(run({ packageJson: { engines: { node: ">=22" } } }).status).toBe("fail");
});
