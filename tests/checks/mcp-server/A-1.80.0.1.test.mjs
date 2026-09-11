import { expect, test } from "@jest/globals";

test("mirrors mcp-server/A-1.80.0.1", async () => {
  await expect(
    import(new URL("../../../src/checks/mcp-server/A-1.80.0.1.mjs", import.meta.url)),
  ).resolves.toBeDefined();
});
