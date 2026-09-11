import { expect, test } from "@jest/globals";

test("mirrors general/collect-files", async () => {
  await expect(
    import(new URL("../../../src/checks/general/collect-files.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
