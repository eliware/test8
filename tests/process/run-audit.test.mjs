import { expect, test } from "@jest/globals";
import { runAudit } from "../../src/process/run-audit.mjs";

test("runs npm audit with an isolated user configuration", async () => {
  let received;
  const result = await runAudit("C:/repo", async (...args) => {
    received = args;
    return { code: 0, stdout: "found 0 vulnerabilities\n", stderr: "" };
  });
  expect(result.code).toBe(0);
  expect(received[0]).toBe(process.execPath);
  expect(received[1]).toEqual(
    expect.arrayContaining([
      "audit",
      "--audit-level=high",
      "--ignore-scripts",
      "--no-package-lock",
    ]),
  );
  expect(received[1].find((argument) => argument.startsWith("--userconfig="))).toMatch(
    /^--userconfig=/,
  );
  expect(received[2]).toEqual({ cwd: "C:/repo" });
});
