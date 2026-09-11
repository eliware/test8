import { expect, test } from "@jest/globals";

test("mirrors discord/A-1.70.0.1", async () => {
  await expect(
    import(new URL("../../../src/checks/discord/A-1.70.0.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
