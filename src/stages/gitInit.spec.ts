import external from "../commands/external";
import log from "../commands/log";
import existsAsync from "../utils/existsAsync";
import gitInit from "./gitInit";

jest.mock("../commands/external");
jest.mock("../commands/log");
jest.mock("../utils/existsAsync");

const existsAsyncMock = existsAsync as jest.Mock<Promise<boolean>>;
const externalMock = external as jest.Mock<Promise<{}>>;
const logMock = log as jest.Mock<void>;

describe("file exists", () => {
  test("logs successful skip message", async () => {
    existsAsyncMock.mockResolvedValueOnce(true);

    await gitInit({ workspace: "." });

    expect(logMock.mock.calls.length).toBe(1);
  });
});

describe("file does not exist", () => {
  test("executes git init", async () => {
    existsAsyncMock.mockResolvedValueOnce(false);

    await gitInit({ workspace: "." });

    expect(externalMock.mock.calls.length).toBe(1);
  });
});
