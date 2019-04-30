import { forEach } from "p-iteration";
import path from "path";

import copy from "../copy.json";
import { IOptions } from "../IOptions";
import copyFileAsync from "../utils/copyFileAsync.js";
import existsAsync from "../utils/existsAsync.js";
import mkdirAsync from "../utils/mkdirAsync.js";

export default async ({ merge, overwrite, workspace }: IOptions) => {
  return forEach(copy, async x => {
    const destination = path.join(workspace, x);
    const source = path.join(__dirname, "..", x);

    if (await existsAsync(destination)) {
      if (merge && merge.includes(x)) {
        // DO MERGE
        return;
      }

      if (overwrite && overwrite.includes(x)) {
        return copyFileAsync(source, destination);
      }

      return;
    }

    const dirname = path.dirname(destination);

    await mkdirAsync(dirname, { recursive: true });
    return copyFileAsync(source, destination);
  });
};
