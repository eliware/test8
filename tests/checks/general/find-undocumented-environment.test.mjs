import { expect, test } from "@jest/globals";

test("mirrors general/find-undocumented-environment", async () => {
  await expect(
    import(
      new URL("../../../src/checks/general/find-undocumented-environment.mjs", import.meta.url)
    ),
  ).resolves.toBeDefined();
});
