import liveServer from "rollup-plugin-live-server";
import { eslint } from "rollup-plugin-eslint";
import filesize from "rollup-plugin-filesize";

const input = {
  "patch-event": "src/exports.js",
  "deep-copy": "src/deep-copy.js",
  patch: "src/patch.js",
  pointer: "src/pointer.js"
};

const format = "esm";
const dir = "dist";
const output = { format, dir };

const plugins = [eslint(), filesize()];
const { ROLLUP_WATCH } = process.env;

if (ROLLUP_WATCH) {
  const liveServerConfig = {
    root: ".",
    open: "/demo/undo-redo.html",
    port: 10001
  };
  plugins.push(liveServer(liveServerConfig));
}
export default { input, plugins, output };
