import { expect, test } from "@jest/globals";

test("mirrors documentation/A-1.100.3", async () => {
  await expect(
    import(new URL("../../../src/checks/documentation/A-1.100.3.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
