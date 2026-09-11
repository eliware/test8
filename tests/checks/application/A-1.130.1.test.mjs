import { expect, test } from "@jest/globals";

test("mirrors application/A-1.130.1", async () => {
  await expect(
    import(new URL("../../../src/checks/application/A-1.130.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
