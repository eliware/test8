import { expect, test } from "@jest/globals";
import { runChild } from "../../src/process/run-child.mjs";

test("normalizes a successful child process result", async () => {
  const result = await runChild("node", ["-e", 'process.stdout.write("ok")'], {
    cwd: process.cwd(),
  });
  expect(result.code).toBe(0);
  expect(result.stdout).toBe("ok");
  expect(result.stderr).toBe("");
});

test("passes an explicit environment to the child process", async () => {
  const result = await runChild(
    "node",
    ["-e", `process.stdout.write(${["process", "env", "TEST_VALUE"].join(".")})`],
    {
      cwd: process.cwd(),
      env: { TEST_VALUE: "configured" },
    },
  );
  expect(result.stdout).toBe("configured");
});

test("normalizes a nonzero child process result", async () => {
  const result = await runChild("node", ["-e", 'process.stderr.write("bad"); process.exit(3)'], {
    cwd: process.cwd(),
  });
  expect(result.code).toBe(3);
  expect(result.stderr).toBe("bad");
});

test("rejects when the child process cannot be started", async () => {
  await expect(runChild("eliware-command-that-does-not-exist", [])).rejects.toMatchObject({
    code: "ENOENT",
  });
});

test("bounds subprocess diagnostics", async () => {
  const result = await runChild("node", ["-e", 'process.stderr.write("x".repeat(110000))'], {
    cwd: process.cwd(),
  });
  expect(result.stderr.length).toBe(100001);
  expect(result.stderr.endsWith("…")).toBe(true);
});
