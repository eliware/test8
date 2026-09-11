import { expect, test } from "@jest/globals";

test("mirrors general/find-missing-surface-indexes", async () => {
  await expect(
    import(
      new URL("../../../src/checks/general/find-missing-surface-indexes.mjs", import.meta.url)
    ),
  ).resolves.toBeDefined();
});
