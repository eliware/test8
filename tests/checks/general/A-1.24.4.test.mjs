import { expect, test } from "@jest/globals";

test("mirrors general/A-1.24.4", async () => {
  await expect(
    import(new URL("../../../src/checks/general/A-1.24.4.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
