#!/usr/bin/env node
import askHidden from "./utils/askHidden.js";
import { loadVault } from "./utils/valut.js";
import { runInit } from "./commands/init.js";
import { runAdd } from "./commands/add.js";
import { runGet } from "./commands/get.js";
import { runList } from "./commands/list.js";
import { runRm } from "./commands/rm.js";
import { runEdit } from "./commands/edit.js";
import { runShell } from "./commands/shell.js";
import type { VaultStore } from "./types/types.js";

export default async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd) {
    process.exitCode = await runShell();
    return;
  }

  if (cmd === "init") {
    return await runInit();
  }

  const pass = await askHidden("Enter master password: ");
  let store: VaultStore;

  try {
    store = loadVault(pass);
  } catch {
    console.error("❌ Invalid password or corrupted vault");
    process.exit(2);
  }

  switch (cmd) {
    case "add":
      process.exitCode = await runAdd(store, pass, args.slice(1));
      return;
    case "get":
      process.exitCode = await runGet(store, pass, args.slice(1));
      return;
    case "list":
      process.exitCode = await runList(store);
      return;
    case "rm":
      process.exitCode = await runRm(store, pass, args.slice(1));
      return;
    case "edit":
      process.exitCode = await runEdit(store, pass, args.slice(1));
      return;
    default:
      console.log("❌ Unknown command");
      process.exit(1);
  }
}

main();
