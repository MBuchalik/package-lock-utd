import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import exitHook from 'exit-hook';

import {
  existsAndIsFileSync,
  logErrorMessage,
  logSuccessMessage,
  readFileContent,
} from './utils';

const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const PACKAGE_LOCK_JSON_PATH = path.join(process.cwd(), 'package-lock.json');

if (!existsAndIsFileSync(PACKAGE_JSON_PATH)) {
  logErrorMessage("File 'package.json' is missing.");
  process.exit(1);
}
if (!existsAndIsFileSync(PACKAGE_LOCK_JSON_PATH)) {
  logErrorMessage("File 'package-lock.json' is missing.");
  process.exit(1);
}

const originalPackageLockReadResult = readFileContent(PACKAGE_LOCK_JSON_PATH);
if (!originalPackageLockReadResult.success) {
  logErrorMessage("Failed to read 'package-lock.json'.");
  process.exit(1);
}

// Restore the original package-lock.json when the process exits.
exitHook(() => {
  fs.writeFileSync(PACKAGE_LOCK_JSON_PATH, originalPackageLockReadResult.data);
});

try {
  execSync('npm install --package-lock-only');
} catch {
  logErrorMessage(
    'Something went wrong generating the updated package-lock.json needed for comparison. This could be a problem with npm.',
  );
  process.exit(1);
}

const updatedPackageLockReadResult = readFileContent(PACKAGE_LOCK_JSON_PATH);
if (!updatedPackageLockReadResult.success) {
  logErrorMessage("Failed to read the updated 'package-lock.json'.");
  process.exit(1);
}

if (originalPackageLockReadResult.data !== updatedPackageLockReadResult.data) {
  logErrorMessage(
    'It seems like package-lock.json is not up to date. Try running "npm install".',
  );
  process.exit(1);
}

logSuccessMessage('package-lock.json is up to date.');
