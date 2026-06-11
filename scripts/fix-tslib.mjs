/**
 * Post-build script: ensures the Nitro vercel output has a complete tslib package.
 *
 * Problem: Nitro's vercel preset externalises tslib in the _libs/ chunks
 * (e.g. supabase__auth-js.mjs imports `{ __rest } from "tslib"`), but only
 * traces a partial copy of tslib into node_modules — specifically, it copies
 * tslib.js, modules/index.js, and package.json, but NOT tslib.es6.mjs.
 *
 * The Node ESM resolver follows the "exports" map in tslib/package.json:
 *   "import" → { "node": "./modules/index.js" }
 * This *should* work when modules/index.js is present (and it is), but some
 * environments still hit ERR_MODULE_NOT_FOUND — possibly because the
 * package was only partially installed (missing tslib.es6.mjs as fallback).
 *
 * Fix: Copy every file from the project-level node_modules/tslib into the
 * function's node_modules/tslib, ensuring nothing is missing.
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SOURCE = resolve("node_modules/tslib");
const TARGET = resolve(".vercel/output/functions/__server.func/node_modules/tslib");

if (!existsSync(SOURCE)) {
  console.error("[fix-tslib] ❌ node_modules/tslib not found — run npm install first.");
  process.exit(1);
}

if (!existsSync(resolve(".vercel/output/functions/__server.func"))) {
  console.warn("[fix-tslib] ⚠️  No .vercel output found — skipping (build may not have run yet).");
  process.exit(0);
}

mkdirSync(TARGET, { recursive: true });
cpSync(SOURCE, TARGET, { recursive: true, force: true });
console.log("[fix-tslib] ✅ Copied complete tslib package into vercel function output.");
