import path from "path";

import external from "../commands/external";
import existsAsync from "../utils/existsAsync";

export default async (workspace: string) => {
  if (await existsAsync(path.join(workspace, ".git"))) {
    return;
  }

  return external({ target: "git", args: ["init"], cwd: workspace });
};
