import { exec } from "child_process";

export default async (target: string) => new Promise<boolean>(res => exec(`${target} -h`).once("exit", code => res(code === 0)));
