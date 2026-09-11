import { expect, test } from "@jest/globals";

test("mirrors documentation/A-1.100.0.1", async () => {
  await expect(
    import(new URL("../../../src/checks/documentation/A-1.100.0.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
