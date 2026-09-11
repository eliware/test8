import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.15.mjs";

test("allows public export barrels", () => {
  expect(
    run({
      root: "C:/repo",
      packageJson: { main: "src/index.mjs" },
      barrelFiles: ["src/index.mjs"],
    }),
  ).toMatchObject({ status: "pass" });
});

test("rejects internal pure export barrels", () => {
  expect(
    run({
      root: "C:/repo",
      packageJson: { main: "src/index.mjs" },
      barrelFiles: ["src/internal.mjs"],
    }),
  ).toMatchObject({ status: "fail" });
});
