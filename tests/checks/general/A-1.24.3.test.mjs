import { expect, test } from "@jest/globals";

test("mirrors general/A-1.24.3", async () => {
  await expect(
    import(new URL("../../../src/checks/general/A-1.24.3.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
