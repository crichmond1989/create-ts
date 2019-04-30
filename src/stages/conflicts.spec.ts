import prompts from "prompts";

import copy from "../copy.json";
import existsAsync from "../utils/existsAsync";
import conflicts from "./conflicts";

jest.mock("prompts");
jest.mock("../utils/existsAsync");

const existsAsyncMock = existsAsync as jest.Mock<Promise<boolean>>;
const promptsMock = (prompts as any) as jest.Mock<Promise<any>>;

beforeEach(() => {
  existsAsyncMock.mockReset();
  promptsMock.mockReset();
});

describe("no pre-existing files", () => {
  test("skip prompts", async () => {
    existsAsyncMock.mockResolvedValue(false);

    await conflicts({ workspace: "." });

    expect(promptsMock.mock.calls.length).toBe(0);
  });
});

describe("has pre-existing files", () => {
  describe("no merge, some overwrite", () => {
    test("call both prompts", async () => {
      existsAsyncMock.mockResolvedValue(true);

      promptsMock.mockResolvedValueOnce({ merge: [] }).mockResolvedValueOnce({ overwrite: [] });

      await conflicts({ workspace: "." });

      expect(promptsMock.mock.calls.length).toBe(2);
    });
  });

  describe("all merge", () => {
    test("skip overwrite", async () => {
      existsAsyncMock.mockResolvedValue(true);

      promptsMock.mockResolvedValueOnce({ merge: copy.map(x => ({ value: x })) });

      await conflicts({ workspace: "." });

      expect(promptsMock.mock.calls.length).toBe(1);
    });
  });
});
