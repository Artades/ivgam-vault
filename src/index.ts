#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as readline from "readline";
import { spawn } from "child_process";
import askHidden from "./utils/askHidden.js";
import { loadVault, saveVault } from "./utils/valut.js";
import type { VaultStore } from "./types/types.js";

const VAULT_PATH = path.join(process.env.HOME || ".", ".local", "vault.dat");

export default async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd) {
    console.log("Использование: vault init | add | get | list | rm");
    process.exit(1);
  }

  if (cmd === "init") {
    if (fs.existsSync(VAULT_PATH)) {
      console.log("⚠️  Vault уже существует по пути", VAULT_PATH);
      process.exit(1);
    }

    const pass = await askHidden("Создайте master пароль: ");
    const pass2 = await askHidden("Подтвердите пароль: ");
    if (pass !== pass2) {
      console.log("❌ Пароли не совпадают");
      process.exit(1);
    }

    saveVault({}, pass);
    console.log("✅ Vault успешно создан:", VAULT_PATH);
    process.exit(0);
  }

  const pass = await askHidden("Введите master пароль: ");
  let store: VaultStore;
  try {
    store = loadVault(pass);
  } catch {
    console.error("❌ Неверный пароль или повреждённое хранилище");
    process.exit(2);
  }

  if (cmd === "add") {
    const key = args[1];
    if (!key) {
      console.log("⚠️ Укажите имя записи");
      process.exit(1);
    } else if (Object.keys(store).length !== 0 && store[key]) {
      console.log("❌ Запись с таким именем уже существует");
      process.exit(1);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const ask = (q: string) =>
      new Promise<string>((res) => rl.question(q, res));

    const username = await ask("Username: ");
    const secret = await askHidden("Password (пусто = сгенерировать): ");

    let passwordVal = secret;
    if (!passwordVal) {
      passwordVal = crypto
        .randomBytes(12)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 16);
      console.log("🔑 Сгенерирован пароль:", passwordVal);
    }
    const url = await ask("URL (опционально): ");
    const notes = await ask("Notes (опционально): ");
    rl.close();

    store[key] = {
      username,
      password: passwordVal,
      url,
      notes,
      updated: new Date().toISOString(),
    };
    saveVault(store, pass);
    console.log(`✅ Добавлено: ${key}`);
    process.exit(0);
  }

  if (cmd === "get") {
    const key = args[1];
    if (!key || !store[key]) {
      console.log("❌ Не найдено");
      process.exit(1);
    }

    const entry = store[key];
    console.log("👤 User:", entry.username || "");
    console.log("🌐 URL:", entry.url || "");
    console.log("📝 Notes:", entry.notes || "");
    console.log("🔑 Password:", entry.password);

    const proc = spawn("pbcopy");
    proc.stdin.write(entry.password);
    proc.stdin.end();
    console.log("(Пароль скопирован в буфер на 10 секунд)");
    setTimeout(() => {
      const clearProc = spawn("pbcopy");
      clearProc.stdin.write("");
      clearProc.stdin.end();
      console.log("🧹 Буфер очищен");
    }, 10000);
    process.exit(0);
  }

  if (cmd === "list") {
    console.log(Object.keys(store).join("\n") || "(пусто)");
    process.exit(0);
  }

  if (cmd === "rm") {
    const key = args[1];
    if (!key || !store[key]) {
      console.log("❌ Не найдено");
      process.exit(1);
    }

    delete store[key];
    saveVault(store, pass);
    console.log(`🗑️  Удалено: ${key}`);
    process.exit(0);
  }
}

main();
