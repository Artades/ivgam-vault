import { stdin, stdout } from "process";

const CLEAR_CURRENT_LINE_CMD = `\x1B[2K`;
const MOVE_CURSOR_TO_NEW_LINE_CMD = `\x1B[200D`;
const NEW_LINE_KEY = `\n`;
const ENTER_KEY = `\r`;
const EOF_KEY = `\u0004`;
const BACKSPACE_KEY = `\x7f`;
const MASK_CHAR = `*`;

async function askHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    let value = "";

    stdout.write(prompt);

    const finish = () => {
      stdout.write(NEW_LINE_KEY);
      stdin.removeListener("data", onDataHandler);
      stdin.setRawMode?.(false);
      stdin.pause();
      resolve(value);
    };

    const onDataHandler = (char: Buffer) => {
      for (const key of char.toString()) {
        if (key === ENTER_KEY || key === NEW_LINE_KEY || key === EOF_KEY) {
          finish();
          return;
        }

        if (key === BACKSPACE_KEY) {
          if (value.length > 0) value = value.slice(0, -1);
        } else {
          value += key;
        }
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
