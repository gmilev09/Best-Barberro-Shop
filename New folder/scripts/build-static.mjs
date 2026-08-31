#!/usr/bin/env node
/**
 * Статичен build за GitHub Pages.
 *
 * Какво прави:
 *  1. Временно изключва /api маршрутите (Pages няма сървър).
 *  2. Пуска `next build` с NEXT_PUBLIC_STATIC_EXPORT=1 → output: "export" → ./out
 *  3. Връща /api обратно дори при грешка.
 *
 * Употреба:
 *   node scripts/build-static.mjs
 *   BASE_PATH=/my-repo node scripts/build-static.mjs   (за project pages)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "src", "app", "api");
const backupDir = path.join(root, ".static-build-backup", "api");

const env = {
  ...process.env,
  NEXT_PUBLIC_STATIC_EXPORT: "1",
};
if (process.env.BASE_PATH && !process.env.NEXT_PUBLIC_BASE_PATH) {
  env.NEXT_PUBLIC_BASE_PATH = process.env.BASE_PATH;
}

function restore() {
  if (fs.existsSync(backupDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
    fs.renameSync(backupDir, apiDir);
    fs.rmSync(path.dirname(backupDir), { recursive: true, force: true });
    console.log("✓ /api маршрутите са възстановени");
  }
}

try {
  if (!fs.existsSync(apiDir)) {
    throw new Error(`Не е намерена директория ${apiDir}`);
  }
  fs.mkdirSync(path.dirname(backupDir), { recursive: true });
  fs.renameSync(apiDir, backupDir);
  console.log("… изключих API маршрутите за статичния износ");

  execSync("npx next build", { cwd: root, stdio: "inherit", env });

  restore();

  if (!fs.existsSync(path.join(root, "out", "index.html"))) {
    throw new Error("out/index.html не е генериран");
  }
  console.log("\n✓ Статичният сайт е готов в ./out — качи съдържанието на GitHub Pages!");
} catch (err) {
  restore();
  console.error(err);
  process.exit(1);
}
