import { fail, pass } from "../check-result.mjs";

export const ruleId = "A-1.20.18";
const canonical = {
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

export function run({ packageJson }) {
  const prettier = packageJson?.prettier;
  const valid =
    prettier &&
    typeof prettier === "object" &&
    !Array.isArray(prettier) &&
    Object.entries(canonical).every(([key, value]) => prettier[key] === value);
  return valid
    ? pass(ruleId)
    : fail(
        ruleId,
        "Maintained Node.js repositories must declare the canonical Prettier configuration.",
      );
}
