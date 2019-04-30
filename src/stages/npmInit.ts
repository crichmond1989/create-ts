import path from "path";

import external from "../commands/external";
import log from "../commands/log";
import { IOptions } from "../IOptions";
import existsAsync from "../utils/existsAsync";
import mkdirAsync from "../utils/mkdirAsync";
import npmTarget from "../utils/npmTarget";

export default async ({ workspace }: IOptions) => {
  if (await existsAsync(path.join(workspace, "package.json"))) {
    return log("npm already initialized", { check: true });
  }

  await mkdirAsync(workspace, { recursive: true });
  return external({ target: npmTarget(), args: ["init", "-y"], cwd: workspace, stdio: "inherit" });
};
