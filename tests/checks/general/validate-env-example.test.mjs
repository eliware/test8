import { expect, test } from "@jest/globals";

test("mirrors general/validate-env-example", async () => {
  await expect(
    import(new URL("../../../src/checks/general/validate-env-example.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
