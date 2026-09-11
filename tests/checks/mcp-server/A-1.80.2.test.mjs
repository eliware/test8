import { expect, test } from "@jest/globals";

test("mirrors mcp-server/A-1.80.2", async () => {
  await expect(
    import(new URL("../../../src/checks/mcp-server/A-1.80.2.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
