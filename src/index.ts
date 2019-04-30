#!/usr/bin/env node

import gitInit from "./stages/gitInit.js";
import copySettings from "./stages/copySettings.js";
import conflicts from "./stages/conflicts.js";
import npmInit from "./stages/npmInit.js";
import npmInstall from "./stages/npmInstall.js";
import copy from "./copy.json";

/*
  npm init
  conflicts
  copy settings
  git init
  npm i -D ...
*/

const run = async () => {
  const workspace = process.argv[2] || process.cwd();
  const mergeAll = process.argv.some(x => x === "-m");
  const overwriteAll = process.argv.some(x => x === "-o");
  const skipAll = process.argv.some(x => x === "-s");

  const options = {
    merge: [] as string[],
    overwrite: [] as string[],
    workspace,
  };

  await npmInit(options);

  if (mergeAll) {
    options.merge = copy;
  } else if (overwriteAll) {
    options.overwrite = copy;
  } else if (!skipAll) {
    const { merge, overwrite } = await conflicts(options);

    if (merge) {
      options.merge = merge;
    }

    if (overwrite) {
      options.overwrite = overwrite;
    }
  }

  await copySettings(options);
  await gitInit(options);
  await npmInstall(options);
};

run().catch(err => console.error(err));
