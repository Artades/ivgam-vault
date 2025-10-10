import { stdin, stdout } from "process";

const CLEAR_CURRENT_LINE_CMD = `\x1B[2K`;
const MOVE_CURSOR_TO_NEW_LINE_CMD = `\x1B[200D`;
const NEW_LINE_KEY = `\n`;
const ENTER_KEY = `\r`;
const EOF_KEY = `\u0004`;
const BACKSPACE_KEYS = [`\x7f`, "\x08"];
const MASK_CHAR = `*`;

async function askHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    let value = "";

    stdout.write(prompt);

    const onDataHandler = (char: Buffer) => {
      const str = char.toString();

      if (str === ENTER_KEY || str === NEW_LINE_KEY || str === EOF_KEY) {
        stdout.write(NEW_LINE_KEY);
        stdin.removeListener("data", onDataHandler);
        stdin.setRawMode?.(false);
        resolve(value);
        return;
      }

      if (BACKSPACE_KEYS.includes(str)) {
        if (value.length > 0) value = value.slice(0, -1);
      } else {
        value += str;
      }

      stdout.write(
        CLEAR_CURRENT_LINE_CMD +
        MOVE_CURSOR_TO_NEW_LINE_CMD +
        prompt +
        MASK_CHAR.repeat(value.length)
      );
    };

    stdin.on("data", onDataHandler);
    stdin.setRawMode?.(true);
    stdin.resume();
  });
}

export default askHidden;
