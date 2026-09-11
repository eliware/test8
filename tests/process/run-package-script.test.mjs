import { expect, test } from "@jest/globals";
import { dirname, join } from "node:path";
import { selectPackageScripts } from "../../src/process/select-package-scripts.mjs";
import { resolveNpmLauncher } from "../../src/process/resolve-npm-launcher.mjs";

test("selects only supported optional package scripts", () => {
  expect(
    selectPackageScripts({
      scripts: {
        test: "recursive",
        audit: "npm audit",
        pack: "npm pack",
        build: "build",
        typecheck: "check",
        lint: "lint",
      },
    }),
  ).toEqual([
    ["audit", "npm audit"],
    ["pack", "npm pack"],
    ["build", "build"],
    ["typecheck", "check"],
  ]);
});

test("rejects an empty defined package script", () => {
  expect(() => selectPackageScripts({ scripts: { audit: " " } })).toThrow(/audit/);
});

test("treats absent or null script collections as empty", () => {
  expect(selectPackageScripts(null)).toEqual([]);
  expect(selectPackageScripts({ scripts: null })).toEqual([]);
});

test("resolves an executable npm launcher pair", () => {
  const [command, script] = resolveNpmLauncher();
  expect(typeof command).toBe("string");
  expect(typeof script).toBe("string");
});

test("uses npm_execpath when npm supplies one", () => {
  const previous = process.env.npm_execpath;
  process.env.npm_execpath = "C:/npm/npm-cli.js";
  try {
    expect(resolveNpmLauncher()).toEqual([process.execPath, "C:/npm/npm-cli.js"]);
  } finally {
    if (previous === undefined) delete process.env.npm_execpath;
    else process.env.npm_execpath = previous;
  }
});

test("uses the portable npm launcher outside Windows", () => {
  const platform = Object.getOwnPropertyDescriptor(process, "platform");
  const previous = process.env.npm_execpath;
  delete process.env.npm_execpath;
  Object.defineProperty(process, "platform", { configurable: true, value: "linux" });
  try {
    expect(resolveNpmLauncher()).toEqual(["npm", ""]);
  } finally {
    Object.defineProperty(process, "platform", platform);
    if (previous === undefined) delete process.env.npm_execpath;
    else process.env.npm_execpath = previous;
  }
});

test("uses the bundled npm launcher on Windows", () => {
  const platform = Object.getOwnPropertyDescriptor(process, "platform");
  const previous = process.env.npm_execpath;
  delete process.env.npm_execpath;
  Object.defineProperty(process, "platform", { configurable: true, value: "win32" });
  try {
    expect(resolveNpmLauncher()).toEqual([
      process.execPath,
      join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js"),
    ]);
  } finally {
    Object.defineProperty(process, "platform", platform);
    if (previous === undefined) delete process.env.npm_execpath;
    else process.env.npm_execpath = previous;
  }
});
