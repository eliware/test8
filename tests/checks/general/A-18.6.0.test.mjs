import { expect, test } from "@jest/globals";

test("mirrors general/A-18.6.0", async () => {
  await expect(
    import(new URL("../../../src/checks/general/A-18.6.0.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
