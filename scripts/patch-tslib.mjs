/**
 * Post-build script: replaces `import { __rest } from "tslib"` in the Nitro
 * server bundle with an inline implementation so the runtime never needs
 * the tslib package at all.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const LIBS_DIR = join(
  process.cwd(),
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "_libs"
);

// Inline replacement for tslib's __rest helper
const TSLIB_INLINE = `
const __rest = (s, e) => {
  const t = {};
  for (const p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
  return t;
};
`;

async function patchFiles() {
  let patched = 0;

  let files;
  try {
    files = await readdir(LIBS_DIR);
  } catch {
    console.log("[patch-tslib] _libs directory not found, skipping.");
    return;
  }

  for (const file of files) {
    if (!file.endsWith(".mjs")) continue;
    const filePath = join(LIBS_DIR, file);
    const content = await readFile(filePath, "utf-8");

    if (!content.includes('"tslib"')) continue;

    // Replace any import from "tslib" with inline implementations
    const updated = content
      .replace(/import\s*\{[^}]*\}\s*from\s*["']tslib["']\s*;?/g, TSLIB_INLINE);

    if (updated !== content) {
      await writeFile(filePath, updated, "utf-8");
      console.log(`[patch-tslib] Patched: ${file}`);
      patched++;
    }
  }

  // Also check _ssr directory
  const SSR_DIR = join(
    process.cwd(),
    ".vercel",
    "output",
    "functions",
    "__server.func",
    "_ssr"
  );
  try {
    const ssrFiles = await readdir(SSR_DIR);
    for (const file of ssrFiles) {
      if (!file.endsWith(".mjs")) continue;
      const filePath = join(SSR_DIR, file);
      const content = await readFile(filePath, "utf-8");
      if (!content.includes('"tslib"')) continue;
      const updated = content
        .replace(/import\s*\{[^}]*\}\s*from\s*["']tslib["']\s*;?/g, TSLIB_INLINE);
      if (updated !== content) {
        await writeFile(filePath, updated, "utf-8");
        console.log(`[patch-tslib] Patched SSR: ${file}`);
        patched++;
      }
    }
  } catch {
    // SSR dir might not exist
  }

  console.log(`[patch-tslib] Done. Patched ${patched} file(s).`);
}

patchFiles().catch((err) => {
  console.error("[patch-tslib] Error:", err);
  process.exit(1);
});
