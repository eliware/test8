import { expect, test } from "@jest/globals";

test("mirrors cli/A-1.60.2", async () => {
  await expect(
    import(new URL("../../../src/checks/cli/A-1.60.2.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
