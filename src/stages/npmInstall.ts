import external from "../commands/external";
import dep from "../dep.json";
import { IOptions } from "../IOptions";
import npmTarget from "../utils/npmTarget";

export default async ({ workspace }: IOptions) =>
  external({
    target: npmTarget(),
    args: ["install", "--save-dev", ...dep],
    cwd: workspace,
    stdio: "inherit",
  });
