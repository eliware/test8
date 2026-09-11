import { expect, test } from "@jest/globals";

test("mirrors application/A-1.130.0", async () => {
  await expect(
    import(new URL("../../../src/checks/application/A-1.130.0.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
