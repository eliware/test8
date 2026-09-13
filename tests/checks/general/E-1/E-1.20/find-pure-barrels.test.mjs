import { expect, test } from "@jest/globals";
import { isPureBarrelSource } from "../../../../../src/checks/general/E-1/E-1.20/find-pure-barrels.mjs";

test("detects export-only modules and rejects implementation modules", () => {
  expect(isPureBarrelSource('export { value } from "./value.mjs";')).toBe(true);
  expect(isPureBarrelSource("const value = 1; export { value };" )).toBe(false);
});
