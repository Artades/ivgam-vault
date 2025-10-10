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
  const command = args[0];

  if (!command) {
    console.log("👾 Hello from Ivgam!\nUsage: vault init | add | get | list | rm | edit");
    process.exit(1);
  }

  if (command === "init") {
    return await runInit();
  }

  const masterPassword = await askHidden("Enter master password: ");
  let store: VaultStore;

  try {
    store = loadVault(masterPassword);
  } catch {
    console.error("❌ Invalid password or corrupted vault");
    process.exit(2);
  }

  switch (command) {
    case "add":
      await runAdd(store, masterPassword, args.slice(1));
      break;
    case "get":
      await runGet(store, masterPassword, args.slice(1));
      break;
    case "list":
      await runList(store);
      break;
    case "rm":
      await runRm(store, masterPassword, args.slice(1));
      break;
    case "edit":
      await runEdit(store, masterPassword, args.slice(1));
      break;
    default:
      console.error("❌ Unknown command");
      process.exit(1);
  }
}

main();
