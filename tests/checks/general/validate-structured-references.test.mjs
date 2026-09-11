import { expect, test } from "@jest/globals";

test("mirrors general/validate-structured-references", async () => {
  await expect(
    import(
      new URL("../../../src/checks/general/validate-structured-references.mjs", import.meta.url)
    ),
  ).resolves.toBeDefined();
});
