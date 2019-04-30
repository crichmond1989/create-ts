import { filter } from "p-iteration";
import path from "path";
import prompts, { Choice } from "prompts";

import copy from "../copy.json";
import { IOptions } from "../IOptions";
import existsAsync from "../utils/existsAsync";

export default async ({ workspace }: IOptions): Promise<{ merge?: string[]; overwrite?: string[] }> => {
  const exists = await filter(copy, x => existsAsync(path.join(workspace, x)));

  if (!exists.length) {
    return {};
  }

  const mergeChoices: Choice[] = exists.map(x => ({ title: x, value: x }));
  const hint = "- Space to select. Return to submit.";

  const mergeResult = await prompts({
    type: "multiselect",
    name: "merge",
    message: "Which files should be merged?",
    choices: mergeChoices,
    hint,
  });

  const overwriteChoices = mergeChoices.filter(x => !(mergeResult.merge as Choice[]).some(y => x.value === y.value));

  if (!overwriteChoices.length) {
    return mergeResult;
  }

  const overwriteResult = await prompts({
    type: "multiselect",
    name: "merge",
    message: "Which files should be overwritten?",
    choices: overwriteChoices,
    hint,
  });

  return { ...mergeResult, ...overwriteResult };
};
