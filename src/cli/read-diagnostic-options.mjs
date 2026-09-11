export function readDiagnosticOptions(args) {
  return {
    ignoredRuleIds: args.includes("--ignore-monolith-limits") ? ["A-18.5.2"] : [],
  };
}
