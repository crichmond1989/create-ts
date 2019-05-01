import prompts from "prompts";

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
  test("skip prompt", async () => {
    existsAsyncMock.mockResolvedValue(false);

    await conflicts(".");

    expect(promptsMock.mock.calls.length).toBe(0);
  });
});

describe("has pre-existing files", () => {
  test("prompt user", async () => {
    existsAsyncMock.mockResolvedValue(true);

    promptsMock.mockResolvedValueOnce({ overwrite: [] });

    await conflicts(".");

    expect(promptsMock.mock.calls.length).toBe(1);
  });
});
