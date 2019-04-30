import chalk from "chalk";

export default (message: string, { check }: { check?: boolean } = {}) => {
  let prefix;

  if (check) {
    prefix = chalk.green("√ ");
  }

  console.log(`${prefix}${message}`);
};
