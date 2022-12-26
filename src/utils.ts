import * as fs from 'fs';

import chalk from 'chalk';

import { Result } from './result';

/**
 * Log an error message.
 */
export function logErrorMessage(message: string): void {
  console.log(chalk.red(message));
}

/**
 * Log a success message.
 */
export function logSuccessMessage(message: string): void {
  console.log(chalk.green(message));
}

/**
 * Does the provided path point to an existing file?
 * This function returns `false` if the path is invalid, or if it points to a directory or the like.
 */
export function existsAndIsFileSync(filePath: fs.PathLike): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    return true;
  }

  return false;
}

export function readFileContent(filePath: fs.PathLike): Result<string> {
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(filePath).toString();
  } catch {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: fileContent,
  };
}
