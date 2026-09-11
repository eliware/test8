import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/documentation/E-1.100.mjs";

test("requires a repository root", () => {
  expect(run({ root: "C:/repo" }).status).toBe("pass");
  expect(run({}).status).toBe("fail");
});
