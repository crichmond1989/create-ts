import { filter } from "p-iteration";
import path from "path";
import prompts, { Choice } from "prompts";

import copy from "../copy.json";
import existsAsync from "../utils/existsAsync";

export default async (workspace: string): Promise<{ overwrite?: string[] }> => {
  const exists = await filter(copy, x => existsAsync(path.join(workspace, x)));

  if (!exists.length) {
    return {};
  }

  const overwriteChoices: Choice[] = exists.map(x => ({ title: x, value: x }));
  const hint = "- Space to select. Return to submit.";

  const overwriteResult = await prompts({
    type: "multiselect",
    name: "overwrite",
    message: "Which files should be overwritten?",
    choices: overwriteChoices,
    hint,
  });

  return { ...overwriteResult };
};
