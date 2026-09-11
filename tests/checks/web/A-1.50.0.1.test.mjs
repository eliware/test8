import { expect, test } from "@jest/globals";

test("mirrors web/A-1.50.0.1", async () => {
  await expect(
    import(new URL("../../../src/checks/web/A-1.50.0.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
