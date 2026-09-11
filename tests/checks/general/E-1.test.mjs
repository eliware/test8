import { expect, test } from "@jest/globals";

test("mirrors general/E-1", async () => {
  await expect(
    import(new URL("../../../src/checks/general/E-1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
