import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/workspace/E-1.110.mjs";

test("requires a workspace root", () => {
  expect(run({ root: "C:/workspace" }).status).toBe("pass");
  expect(run({}).status).toBe("fail");
});
