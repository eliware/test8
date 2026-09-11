import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run as runOutdated } from "../../src/checks/general/E-1.20.12.mjs";
import { run as runDependencyRanges } from "../../src/checks/general/E-1.20.13.mjs";
import { run as runUnused } from "../../src/checks/general/E-1.20.14.mjs";
import { run as runBarrels } from "../../src/checks/general/E-1.20.15.mjs";

const roots = [];
async function rootWith(files = {}) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-deps-"));
  roots.push(root);
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, content);
  }
  return root;
}
afterEach(async () =>
  Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))),
);

test("npm outdated enforcement handles all result states", async () => {
  const root = await rootWith();
  await expect(runOutdated({ root, packageJson: {} })).resolves.toMatchObject({ status: "pass" });
  const unavailable = async () => ({ code: 1, stdout: "", stderr: "network unavailable" });
  await expect(
    runOutdated({ root, packageJson: { dependencies: { jest: "^30" } }, execute: unavailable }),
  ).resolves.toMatchObject({ status: "fail" });
  await expect(
    runOutdated({
      root,
      packageJson: { dependencies: { jest: "^30" } },
      execute: async () => ({ code: 0, stdout: "not-json" }),
    }),
  ).resolves.toMatchObject({ status: "fail" });
  for (const stdout of ["{}", ""]) {
    await expect(
      runOutdated({
        root,
        packageJson: { dependencies: { jest: "^30" } },
        execute: async () => ({ code: 0, stdout }),
      }),
    ).resolves.toMatchObject({ status: "pass" });
  }
  await expect(
    runOutdated({
      root,
      packageJson: { dependencies: { jest: "^30" } },
      execute: async () => ({ code: 1, stdout: JSON.stringify({ jest: {} }) }),
    }),
  ).resolves.toMatchObject({ status: "fail" });
});

test("direct dependency declarations must be non-empty strings", () => {
  expect(runDependencyRanges({ packageJson: {} })).toMatchObject({ status: "pass" });
  expect(
    runDependencyRanges({
      packageJson: { dependencies: { jest: "^30" }, optionalDependencies: { foo: " " } },
    }),
  ).toMatchObject({ status: "fail" });
  expect(runDependencyRanges({ packageJson: { dependencies: { jest: 30 } } })).toMatchObject({
    status: "fail",
  });
});

test("unused dependency enforcement handles injected and discovered references", async () => {
  const root = await rootWith({ "src/index.mjs": 'import x from "used"; export { x };' });
  await expect(
    runUnused({
      root,
      packageJson: { dependencies: { used: "1", unused: "1" } },
      referencedDependencies: new Set(["used"]),
    }),
  ).resolves.toMatchObject({ status: "fail" });
  await expect(
    runUnused({ root, packageJson: { dependencies: { used: "1" } } }),
  ).resolves.toMatchObject({ status: "pass" });
  await expect(
    runUnused({ root, packageJson: { dependencies: { absent: "1" } } }),
  ).resolves.toMatchObject({ status: "fail" });
});

test("pure export barrels allow only the declared public entrypoint", () => {
  expect(runBarrels({ root: "C:\\repo", packageJson: {}, barrelFiles: [] })).toMatchObject({
    status: "pass",
  });
  expect(runBarrels({ root: "C:\\repo", packageJson: {} })).toMatchObject({ status: "pass" });
  expect(
    runBarrels({
      root: "C:\\repo",
      packageJson: { main: "src/index.mjs" },
      barrelFiles: ["C:\\repo\\src\\index.mjs"],
    }),
  ).toMatchObject({ status: "pass" });
  expect(
    runBarrels({
      root: "C:\\repo",
      packageJson: { main: "src/index.mjs" },
      barrelFiles: ["C:\\repo\\src\\internal.mjs"],
    }),
  ).toMatchObject({ status: "fail" });
  expect(
    runBarrels({
      root: "C:\\repo",
      packageJson: { exports: ["src/index.mjs"] },
      barrelFiles: ["C:\\repo\\src\\index.mjs"],
    }),
  ).toMatchObject({ status: "pass" });
  expect(
    runBarrels({
      root: "C:\\repo",
      packageJson: { exports: { ".": "src/index.mjs" } },
      barrelFiles: ["C:\\repo\\src\\internal.mjs"],
    }),
  ).toMatchObject({ status: "fail" });
});
