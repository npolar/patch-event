const input = {
  type: "src/type.js",
  host: "src/host.js",
  patch: "src/patch.js",
  "patch-event": "src/patch-event.js",
  pointer: "src/pointer.js"
};

const format = "esm";
const dir = "dist";
const output = { format, dir };

const plugins = [];
const { ROLLUP_WATCH } = process.env;
import liveServer from "rollup-plugin-live-server";
if (ROLLUP_WATCH) {

  const liveServerConfig = {
    root: ".",
    open: "/demo",
    port: 10001
  };
  plugins.push(liveServer(liveServerConfig));
}
export default { input, plugins, output };
