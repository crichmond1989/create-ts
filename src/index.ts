#!/usr/bin/env node

import yargs from "yargs";

import copy from "./copy.json";
import conflicts from "./stages/conflicts.js";
import copySettings from "./stages/copySettings.js";
import gitInit from "./stages/gitInit.js";
import npmInit from "./stages/npmInit.js";
import npmInstall from "./stages/npmInstall.js";

/*
  npm init
  conflicts
  copy settings
  git init
  npm i -D ...
*/

const run = async (args: { starter: string; destination: string; overwrite: boolean }) => {
  const { starter, destination: workspace, overwrite: overwriteAll } = args;

  let overwrite: string[] = [];

  await npmInit(workspace, starter);

  if (overwriteAll) {
    overwrite = copy;
  } else {
    const conflict = await conflicts(workspace);

    if (conflict.overwrite) {
      overwrite = conflict.overwrite;
    }
  }

  await copySettings(workspace, overwrite);
  await gitInit(workspace);
  await npmInstall(workspace);
};

yargs
  .command(
    "$0 [destination] [starter]",
    "",
    args =>
      args
        .positional("destination", {
          default: ".",
        })
        .positional("starter", {
          describe: "node, react, stencil",
          default: "node",
        })
        .option("overwrite", {
          boolean: true,
        })
        .alias("o", "overwrite"),
    args => run(args as any).catch(e => console.error(e)),
  )
  .alias("h", "help")
  .alias("v", "version")
  .help().argv;
