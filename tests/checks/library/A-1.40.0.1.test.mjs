import { expect, test } from "@jest/globals";

test("mirrors library/A-1.40.0.1", async () => {
  await expect(
    import(new URL("../../../src/checks/library/A-1.40.0.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
