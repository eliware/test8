import { expect, test } from "@jest/globals";

test("mirrors general/validate-packed-files", async () => {
  await expect(
    import(new URL("../../../src/checks/general/validate-packed-files.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
