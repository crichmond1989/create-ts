import path from "path";

import external from "../commands/external";
import targetExists from "../commands/targetExists";
import existsAsync from "../utils/existsAsync";
import mkdirAsync from "../utils/mkdirAsync";
import npmTarget from "../utils/npmTarget";
import vueTarget from "../utils/vueTarget";

export default async (workspace: string, starter: string) => {
  if (await existsAsync(path.join(workspace, "package.json"))) {
    return;
  }

  const args = ["init"];

  switch (starter) {
    case "node":
      args.push("-y");
      break;
    case "react":
      args.push("react-app", ".", "--typescript");
      break;
    case "stencil":
      return npmInitStencil(workspace);
    case "vue":
      return createVue(workspace);
  }

  await mkdirAsync(workspace, { recursive: true });

  return external({ target: npmTarget(), args, cwd: workspace, stdio: "inherit" });
};

const npmInitStencil = async (workspace: string) => {
  const absWorkspace = path.resolve(workspace);
  const dirname = path.basename(absWorkspace);
  const parent = path.join(workspace, "..");

  await mkdirAsync(parent, { recursive: true });

  return external({ target: npmTarget(), args: ["init", "stencil", "component", dirname], cwd: parent, stdio: "inherit" });
};

const createVue = async (workspace: string) => {
  const absWorkspace = path.resolve(workspace);
  const dirname = path.basename(absWorkspace);
  const parent = path.join(workspace, "..");

  await mkdirAsync(parent, { recursive: true });

  if (!(await targetExists(vueTarget()))) {
    await external({ target: npmTarget(), args: ["install", "--global", "@vue/cli"], cwd: parent, stdio: "inherit" });
  }

  const presetPath = path.join(__dirname, "..", "vue", "presets.json");

  return external({ target: vueTarget(), args: ["create", "--preset", presetPath, dirname], cwd: parent, stdio: "inherit" });
};
