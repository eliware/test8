import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { jest, expect, test } from "@jest/globals";

const readdir = jest.fn().mockRejectedValue(new Error("directory unavailable"));
jest.unstable_mockModule("node:fs/promises", () => ({
  access: jest.fn().mockResolvedValue(undefined),
  readdir,
}));

const { run } = await import("../../src/checks/library/A-1.40.1.mjs");

test("reports an unavailable examples directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-library-examples-"));

  await expect(run({ root })).resolves.toMatchObject({
    ruleId: "A-1.40.1",
    status: "fail",
    message: "Libraries require an examples directory.",
  });
  expect(readdir).toHaveBeenCalled();
});
