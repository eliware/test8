import { expect, test } from "@jest/globals";

test("mirrors general/find-test-mapping-violations", async () => {
  await expect(
    import(
      new URL("../../../src/checks/general/find-test-mapping-violations.mjs", import.meta.url)
    ),
  ).resolves.toBeDefined();
});
