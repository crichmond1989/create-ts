import external from "../commands/external";
import dep from "../dep.json";
import npmTarget from "../utils/npmTarget";

export default async (workspace: string) =>
  external({
    target: npmTarget(),
    args: ["install", "--save-dev", ...dep],
    cwd: workspace,
    stdio: "inherit",
  });
