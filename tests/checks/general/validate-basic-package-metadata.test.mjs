import { expect, test } from "@jest/globals";

test("mirrors general/validate-basic-package-metadata", async () => {
  await expect(
    import(
      new URL("../../../src/checks/general/validate-basic-package-metadata.mjs", import.meta.url)
    ),
  ).resolves.toBeDefined();
});
