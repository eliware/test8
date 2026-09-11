import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/mcp-server/E-1.80.mjs";

test("requires application conventions", () => {
  expect(
    run({
      packageJson: {
        eliware: { conventions: { apply: ["general", "mcp-server", "application"] } },
      },
    }).status,
  ).toBe("pass");
  expect(
    run({ packageJson: { eliware: { conventions: { apply: ["general", "mcp-server"] } } } }).status,
  ).toBe("fail");
});
