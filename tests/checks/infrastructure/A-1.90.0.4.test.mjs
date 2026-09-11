import { expect, test } from "@jest/globals";

test("mirrors infrastructure/A-1.90.0.4", async () => {
  await expect(
    import(new URL("../../../src/checks/infrastructure/A-1.90.0.4.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
