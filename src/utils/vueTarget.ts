import os from "os";

export default () => (os.platform() === "win32" ? "vue.cmd" : "vue");
