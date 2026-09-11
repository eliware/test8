import { expect, test } from "@jest/globals";

test("mirrors cli/E-1.60.1", async () => {
  await expect(
    import(new URL("../../../src/checks/cli/E-1.60.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
