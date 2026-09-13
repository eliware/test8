import { expect, test } from "@jest/globals";
import { run } from "../../../../src/checks/web/E-1.50/E-1.50.5.mjs";

test("requires browser validation dependencies and scripts", () => {
  const packageJson = { dependencies: { lighthouse: "1", puppeteer: "1" }, scripts: { lighthouse: "lighthouse", puppeteer: "puppeteer" } };
  expect(run({ packageJson }).status).toBe("pass");
  expect(run({ packageJson: { ...packageJson, scripts: {} } }).status).toBe("fail");
});
