# Architecture

The v8 implementation uses versioned machine-readable specifications, focused
check modules under `src/checks/<group>/`, and thin orchestrators. The selected
groups and exact exemptions come from `package.json.eliware.conventions`; the
CLI does not infer project type from repository contents.
