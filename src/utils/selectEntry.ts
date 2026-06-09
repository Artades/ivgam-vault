import * as readline from "readline";
import { stdin, stdout } from "process";

const ENTER_KEY = "\r";
const NEW_LINE_KEY = "\n";
const BACKSPACE_KEY = "\x7f";
const CTRL_C_KEY = "\x03";
const ESCAPE_KEY = "\x1b";
const ARROW_UP_KEY = "\x1b[A";
const ARROW_DOWN_KEY = "\x1b[B";
const MAX_VISIBLE_ITEMS = 8;

export async function selectEntry(
  keys: string[],
  initialQuery = "",
): Promise<string | undefined> {
  if (keys.length === 0) return undefined;

  let query = initialQuery;
  let selectedIndex = 0;

  const getFilteredKeys = () => {
    const normalizedQuery = query.toLowerCase();
    if (!normalizedQuery) return keys;

    return keys.filter((key) =>
      key.toLowerCase().includes(normalizedQuery),
    );
  };

  return new Promise((resolve) => {
    const cleanup = () => {
      stdin.removeListener("data", onData);
      stdin.setRawMode?.(false);
      stdin.pause();
      stdout.write("\n");
    };

    const render = () => {
      const filteredKeys = getFilteredKeys();
      selectedIndex = Math.min(selectedIndex, Math.max(filteredKeys.length - 1, 0));

      readline.cursorTo(stdout, 0, 0);
      readline.clearScreenDown(stdout);

      stdout.write("Select an entry\n");
      stdout.write(`Search: ${query}\n\n`);

      if (filteredKeys.length === 0) {
        stdout.write("  No entries found\n");
        stdout.write("\nEsc - cancel\n");
        return;
      }

      for (const [index, key] of filteredKeys.slice(0, MAX_VISIBLE_ITEMS).entries()) {
        const marker = index === selectedIndex ? "›" : " ";
        stdout.write(`${marker} ${key}\n`);
      }

      if (filteredKeys.length > MAX_VISIBLE_ITEMS) {
        stdout.write(`  ...${filteredKeys.length - MAX_VISIBLE_ITEMS} more\n`);
      }

      stdout.write("\n↑/↓ - select, Enter - open, Esc - cancel\n");
    };

    const onData = (char: Buffer) => {
      const key = char.toString();
      const filteredKeys = getFilteredKeys();

      if (key === CTRL_C_KEY || key === ESCAPE_KEY) {
        cleanup();
        resolve(undefined);
        return;
      }

      if (key === ENTER_KEY || key === NEW_LINE_KEY) {
        const selectedKey = filteredKeys[selectedIndex];
        cleanup();
        resolve(selectedKey);
        return;
      }

      if (key === ARROW_UP_KEY) {
        selectedIndex = Math.max(selectedIndex - 1, 0);
        render();
        return;
      }

      if (key === ARROW_DOWN_KEY) {
        selectedIndex = Math.min(selectedIndex + 1, filteredKeys.length - 1);
        render();
        return;
      }

      if (key === BACKSPACE_KEY) {
        query = query.slice(0, -1);
        selectedIndex = 0;
        render();
        return;
      }

      if (key.length === 1 && key >= " ") {
        query += key;
        selectedIndex = 0;
        render();
      }
    };

    stdin.on("data", onData);
    stdin.setRawMode?.(true);
    stdin.resume();
    render();
  });
}
