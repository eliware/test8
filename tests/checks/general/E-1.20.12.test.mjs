import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/E-1.20.12.mjs";

const execute =
  (stdout, code = 0) =>
  async () => ({ code, stdout, stderr: "" });

test("passes when no direct dependencies exist", async () => {
  await expect(run({ packageJson: {} })).resolves.toMatchObject({ status: "pass" });
});

test("passes when npm reports no outdated direct dependencies", async () => {
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0" } },
      execute: execute("{}"),
    }),
  ).resolves.toMatchObject({ status: "pass" });
});

test("fails on outdated or malformed npm output", async () => {
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0" } },
      execute: execute('{"jest":{"current":"29.0.0"}}'),
    }),
  ).resolves.toMatchObject({ status: "fail" });
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0" } },
      execute: execute("not-json"),
    }),
  ).resolves.toMatchObject({ status: "fail" });
  await expect(
    run({
      root: "C:/repo",
      packageJson: { dependencies: { jest: "^30.0.0" } },
      execute: execute("", 1),
    }),
  ).resolves.toMatchObject({ status: "fail" });
});
