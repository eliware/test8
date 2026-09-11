import { expect, test } from "@jest/globals";

test("mirrors check-result", async () => {
  await expect(
    import(new URL("../../src/checks/check-result.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
