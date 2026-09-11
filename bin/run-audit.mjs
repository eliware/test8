#!/usr/bin/env node
import { runAudit } from "../src/process/run-audit.mjs";

const result = await runAudit(process.cwd());
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
process.exitCode = result.code ?? 1;
