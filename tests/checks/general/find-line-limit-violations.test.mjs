import { expect, test } from "@jest/globals";

test("mirrors general/find-line-limit-violations", async () => {
  await expect(
    import(new URL("../../../src/checks/general/find-line-limit-violations.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
