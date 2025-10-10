import * as readline from "readline";
import askHidden from "./askHidden.js";

export enum EDIT_MODES {
  VISIBLE,
  HIDDEN,
}

export default async function edit(
  previous: string,
  q: string,
  mode: EDIT_MODES
): Promise<string> {
  if (mode === EDIT_MODES.HIDDEN) {
    return await askHidden(q);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  return new Promise<string>((resolve) => {
    rl.question(q, (answer) => {
      rl.close();
      resolve(answer);
    });

    rl.write(previous);
  });
}
