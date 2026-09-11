export async function runConventionStage(runChecks) {
  try {
    const results = await runChecks();
    const diagnostics = results
      .filter(({ status }) => status === "fail")
      .map(({ ruleId, message }) => `${ruleId}: ${message}`);
    return {
      code: diagnostics.length > 0 ? 18 : 0,
      category: "conventions",
      diagnostics,
    };
  } catch (error) {
    return { code: 18, category: "conventions", diagnostics: [error.message] };
  }
}
