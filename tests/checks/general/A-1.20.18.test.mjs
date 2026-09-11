import { expect, test } from "@jest/globals";
import { run } from "../../../src/checks/general/A-1.20.18.mjs";

test("requires the canonical Prettier options", () => {
  const prettier = {
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
  };
  expect(run({ packageJson: { prettier } }).status).toBe("pass");
  expect(run({ packageJson: { prettier: { ...prettier, printWidth: 80 } } }).status).toBe("fail");
});
