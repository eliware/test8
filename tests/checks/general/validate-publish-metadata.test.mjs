import { expect, test } from "@jest/globals";

test("mirrors general/validate-publish-metadata", async () => {
  await expect(
    import(new URL("../../../src/checks/general/validate-publish-metadata.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
