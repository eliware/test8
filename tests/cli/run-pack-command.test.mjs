import { runPackCommand } from "../../src/cli/run-pack-command.mjs";

test("runs npm pack in dry-run mode and reports its output", async () => {
  const calls = [];
  const output = [];
  const execute = async (...args) => {
    calls.push(args);
    return { code: 0, stdout: "pack stdout", stderr: "" };
  };
  await expect(runPackCommand("C:/repo", (value) => output.push(value), execute)).resolves.toBe(0);
  expect(calls[0][1]).toEqual([expect.any(String), "pack", "--dry-run"]);
  expect(calls[0][2]).toEqual({ cwd: "C:/repo" });
  expect(output).toEqual(["pack stdout"]);
});
