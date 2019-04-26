import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";

import copy from "./copy.json";
import dep from "./dep.json";

const copyFile = promisify(fs.copyFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const dist = __dirname;

/*
  1. npm init
  2. copy settings
  3. git init
  4. npm i -D ...
*/

const npmCommand = () => (os.platform() === "win32" ? "npm.cmd" : "npm");

const npmInit = async (workspace: string) => {
  console.log("1. npm init");

  if (await exists(path.join(workspace, "package.json"))) {
    console.log("Skip: already initialized.");
    return null;
  }

  await mkdir(workspace, { recursive: true });

  const command = os.platform() === "win32" ? "npm.cmd" : "npm";

  const proc = await spawn(npmCommand(), ["init", "-y"], { cwd: workspace, stdio: "inherit" });

  return new Promise(res => proc.once("close", () => res()));
};

const copySettings = async (workspace: string) => {
  console.log("2. copy settings");

  const promises = copy.map(async x => {
    const destination = path.join(workspace, x);

    if (await exists(destination)) {
      console.log(`${x}: Skip.`);
      return null;
    }

    const dirname = path.dirname(destination);

    await mkdir(dirname, { recursive: true });
    await copyFile(path.join(dist, x), destination);

    console.log(`${x}: Copy.`);
  });

  await Promise.all(promises);
};

const gitInit = async (workspace: string) => {
  console.log("3. git init");

  if (await exists(path.join(workspace, ".git"))) {
    console.log("Skip: already initialized");
    return null;
  }

  const proc = await spawn("git", ["init"], { cwd: workspace, stdio: "inherit" });

  return new Promise(res => proc.once("close", () => res()));
};

const npmInstall = async (workspace: string) => {
  console.log("4. npm i -D ...");

  const proc = await spawn(npmCommand(), ["install", "--save-dev", ...dep], { cwd: workspace, stdio: "inherit" });

  return new Promise(res => proc.once("close", () => res()));
};

const run = async () => {
  const workspace = process.argv[2] || process.cwd();

  await npmInit(workspace);
  await copySettings(workspace);
  await gitInit(workspace);
  await npmInstall(workspace);
};

run().catch(err => console.error(err));
