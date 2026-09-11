import { expect, test } from "@jest/globals";

test("mirrors general/walk-files", async () => {
  await expect(
    import(new URL("../../../src/checks/general/walk-files.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
