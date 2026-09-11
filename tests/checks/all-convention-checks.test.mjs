import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@jest/globals";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (/^[EA]-\d+(?:\.\d+)*\.mjs$/.test(entry.name)) files.push(path);
  }
  return files;
}

test("every convention check module has a stable pass/fail result", async () => {
  const root = join(process.cwd(), "src", "checks");
  const packageJson = {
    name: "@eliware/test",
    scripts: { pack: "npm pack --dry-run" },
    main: "index.mjs",
    files: ["src"],
  };
  const contextOptions = {
    executePackage: async () => ({ code: 0, stdout: "", stderr: "" }),
  };
  const modules = await collect(root);
  expect(modules.length).toBeGreaterThan(0);
  for (const path of modules) {
    const module = await import(pathToFileURL(path));
    const result = await module.run({ root: process.cwd(), packageJson, ...contextOptions });
    expect(result.ruleId).toBe(module.ruleId);
    expect(["pass", "fail"]).toContain(result.status);
    expect(typeof result.message).toBe("string");
    const invalid = await module.run({
      root: join(process.cwd(), "missing-test-root"),
      packageJson: {},
      ...contextOptions,
    });
    expect(invalid.ruleId).toBe(module.ruleId);
    expect(["pass", "fail"]).toContain(invalid.status);
    expect(typeof invalid.message).toBe("string");
  }
});
