export async function runLifecycle({ runConventions, runTests, runCoverage, runLint, runPackage }) {
  const results = [];
  const conventions = await runConventions();
  results.push(conventions);
  if (conventions.code !== 0) return { code: conventions.code, results };

  for (const stage of [runTests, runCoverage, runLint, runPackage]) {
    results.push(await stage());
  }
  return {
    code: Math.max(...results.map(({ code }) => code)),
    results,
  };
}
