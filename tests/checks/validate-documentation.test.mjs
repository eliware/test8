import { expect, test } from "@jest/globals";

test("mirrors validate-documentation", async () => {
  await expect(
    import(new URL("../../src/checks/validate-documentation.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
