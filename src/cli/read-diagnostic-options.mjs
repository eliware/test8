export function readDiagnosticOptions(args) {
  return {
    ignoredRuleIds: [
      ...(args.includes("--ignore-100x4") ? ["E-1.20.10"] : []),
      ...(args.includes("--ignore-monolith-limits") ? ["E-1.20.16"] : []),
    ],
    jestArgs: args,
  };
}
