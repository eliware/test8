import { expect, test } from "@jest/globals";

test("mirrors workspace/A-1.110.0.3", async () => {
  await expect(
    import(new URL("../../../src/checks/workspace/A-1.110.0.3.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
