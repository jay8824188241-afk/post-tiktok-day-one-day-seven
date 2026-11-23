// main.ts — the entrypoint for make.fun's "Day one, day seven" bounty.
// It does exactly one thing: copy VIDEO.json from the repository to /output.
// Standard library only; no network, no wall clock, deterministic output.
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, "VIDEO.json"), join(outDir, "VIDEO.json"));
