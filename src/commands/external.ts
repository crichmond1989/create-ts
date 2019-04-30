import { spawn, SpawnOptions } from "child_process";

import IAppState from "../IAppState";

export interface IExternalCommand {
  args: string[];
  cwd: string;
  target: string;
  stdio?: SpawnOptions["stdio"];
}

export default async ({ args, cwd, stdio, target }: IExternalCommand) => {
  const proc = await spawn(target, args, { cwd, stdio: stdio || "inherit" });

  return new Promise(res => proc.once("close", () => res()));
};
