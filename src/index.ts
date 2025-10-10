#!/usr/bin/env node
import askHidden from "./utils/askHidden.js";
import { loadVault } from "./utils/valut.js";
import { runInit } from "./commands/init.js";
import { runAdd } from "./commands/add.js";
import { runGet } from "./commands/get.js";
import { runList } from "./commands/list.js";
import { runRm } from "./commands/rm.js";
import { runEdit } from "./commands/edit.js";
import type { VaultStore } from "./types/types.js";


export default async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd) {
    console.log("Использование: vault init | add | get | list | rm | edit");
    process.exit(1);
  }

  if (cmd === "init") {
    return await runInit();
  }

  const pass = await askHidden("Введите master пароль: ");
  let store: VaultStore;

  try {
    store = loadVault(pass);
  } catch {
    console.error("❌ Неверный пароль или повреждённое хранилище");
    process.exit(2);
  }

  switch (cmd) {
    case "add":
      return await runAdd(store, pass, args.slice(1));
    case "get":
      return await runGet(store, pass, args.slice(1));
    case "list":
      return await runList(store);
    case "rm":
      return await runRm(store, pass, args.slice(1));
    case "edit":
      return await runEdit(store, pass, args.slice(1));
    default:
      console.log("❌ Неизвестная команда");
      process.exit(1);
  }
}

main();
