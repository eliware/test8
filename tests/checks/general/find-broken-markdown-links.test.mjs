import { expect, test } from "@jest/globals";

test("mirrors general/find-broken-markdown-links", async () => {
  await expect(
    import(new URL("../../../src/checks/general/find-broken-markdown-links.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
