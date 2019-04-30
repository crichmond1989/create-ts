import path from "path";

import external from "../commands/external";
import log from "../commands/log";
import { IOptions } from "../IOptions";
import existsAsync from "../utils/existsAsync";

export default async ({ workspace }: IOptions) => {
  if (await existsAsync(path.join(workspace, ".git"))) {
    return log(".git already exists", { check: true });
  }

  return external({ target: "git", args: ["init"], cwd: workspace });
};
