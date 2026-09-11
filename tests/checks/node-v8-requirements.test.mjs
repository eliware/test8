import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "@jest/globals";
import { run as runEnv } from "../../src/checks/general/E-1.20.8.mjs";
import { run as runLines } from "../../src/checks/general/E-1.20.16.mjs";
import { run as runPrettier } from "../../src/checks/general/A-1.20.18.mjs";

const roots = [];

async function rootWith(files = {}) {
  const root = await mkdtemp(join(tmpdir(), "eliware-test8-v8-"));
  roots.push(root);
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, content);
  }
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("environment configuration passes when no environment access is declared", async () => {
  const root = await rootWith({ "package.json": "{}" });
  await expect(runEnv({ root })).resolves.toEqual({
    ruleId: "E-1.20.8",
    status: "pass",
    message: "",
  });
});

test("environment configuration requires an example file when declared", async () => {
  const root = await rootWith({ "package.json": `${["process", "env", "PORT"].join(".")}` });
  await expect(runEnv({ root })).resolves.toMatchObject({ ruleId: "E-1.20.8", status: "fail" });
  await writeFile(join(root, ".env.example"), "PORT=3000\n");
  await expect(runEnv({ root })).resolves.toEqual({
    ruleId: "E-1.20.8",
    status: "pass",
    message: "",
  });
});

test("environment configuration validates every variable and safe placeholders", async () => {
  const root = await rootWith({
    "package.json": `${["process", "env", "PORT"].join(".")}; ${["process", "env", "HOST"].join(".")};`,
  });
  await writeFile(join(root, ".env.example"), "PORT=\n");
  await expect(runEnv({ root })).resolves.toMatchObject({ status: "fail" });
  await writeFile(join(root, ".env.example"), "PORT=3000\nHOST=localhost\n");
  await expect(runEnv({ root })).resolves.toMatchObject({ status: "pass" });
  await writeFile(join(root, ".env.example"), "PORT=secret-token\nHOST=localhost\n");
  await expect(runEnv({ root })).resolves.toMatchObject({ status: "fail" });
  await mkdir(join(root, "src"), { recursive: true });
  await writeFile(
    join(root, "src", "config.mjs"),
    `export const missing = ${["process", "env", "MISSING"].join(".")};\n`,
  );
  await writeFile(join(root, ".env.example"), "PORT=3000\nHOST=localhost\n");
  await expect(runEnv({ root })).resolves.toMatchObject({ status: "fail" });
  await expect(runEnv({ root: join(root, "missing") })).resolves.toMatchObject({ status: "fail" });
});

test("line limits pass for short source and test files", async () => {
  const root = await rootWith({
    "src/index.mjs": "export {};\n",
    "tests/index.test.mjs": "test(() => {});\n",
  });
  await expect(runLines({ root })).resolves.toEqual({
    ruleId: "E-1.20.16",
    status: "pass",
    message: "",
  });
});

test("line limits fail for an oversized source file", async () => {
  const root = await rootWith({ "src/index.mjs": `${"x\n".repeat(101)}` });
  await expect(runLines({ root })).resolves.toMatchObject({ ruleId: "E-1.20.16", status: "fail" });
});

test("Prettier configuration requires a package configuration object", () => {
  expect(runPrettier({ packageJson: {} })).toMatchObject({ ruleId: "A-1.20.18", status: "fail" });
  expect(
    runPrettier({
      packageJson: {
        prettier: {
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: false,
          quoteProps: "as-needed",
          jsxSingleQuote: false,
          trailingComma: "all",
          bracketSpacing: true,
          bracketSameLine: false,
          arrowParens: "always",
          proseWrap: "preserve",
          endOfLine: "lf",
        },
      },
    }),
  ).toMatchObject({ ruleId: "A-1.20.18", status: "pass" });
});
