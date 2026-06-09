import * as readline from "readline";
import askHidden from "../utils/askHidden.js";
import { loadVault } from "../utils/valut.js";
import { runAdd } from "./add.js";
import { runEdit } from "./edit.js";
import { runGet } from "./get.js";
import { runList } from "./list.js";
import { runRm } from "./rm.js";
import type { VaultStore } from "../types/types.js";

export async function runShell(): Promise<number> {
  const pass = await askHidden("Enter master password: ");
  let store: VaultStore;

  try {
    store = loadVault(pass);
  } catch {
    console.error("❌ Invalid password or corrupted vault");
    return 2;
  }

  console.log("Ivgam Vault. help - commands, exit - quit");

  while (true) {
    const line = await askLine("vault> ");
    const [cmd, ...args] = parseArgs(line);

    process.exitCode = 0;

    if (!cmd) continue;
    if (cmd === "exit" || cmd === "quit") return 0;
    if (cmd === "help") {
      printHelp();
      continue;
    }

    switch (cmd) {
      case "add":
        await runAdd(store, pass, args);
        break;
      case "get":
        await runGet(store, pass, args, {
          waitForClipboardClear: false,
          showClipboardCleared: false,
        });
        break;
      case "list":
        await runList(store);
        break;
      case "rm":
        await runRm(store, pass, args);
        break;
      case "edit":
        await runEdit(store, pass, args);
        break;
      default:
        console.log("❌ Unknown command");
    }
  }
}

function askLine(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function parseArgs(line: string): string[] {
  //just extracting arguments from the line
  const args = line.match(/"([^"]*)"|'([^']*)'|\S+/g) ?? [];

  return args.map((arg) => {
    if (
      (arg.startsWith('"') && arg.endsWith('"')) ||
      (arg.startsWith("'") && arg.endsWith("'"))
    ) {
      return arg.slice(1, -1);
    }

    return arg;
  });
}

function printHelp() {
  console.log("Commands:");
  console.log("  list");
  console.log("  get [name]");
  console.log("  add <name>");
  console.log("  edit <name>");
  console.log("  rm <name>");
  console.log("  exit");
}
