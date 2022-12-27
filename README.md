# package-lock-utd

> Checks if package-lock.json is Up To Date (= UTD)

Have you ever made a change to `package.json` and forgot to run `npm install` to apply this change to `package-lock.json`? Many projects use a CI action to catch such inconsistencies. However, these CI actions often only rely on `npm ci`, which only catches a subset of inconsistencies. For instance, `npm ci` does **NOT** fail when the `name` or `version` field are unequal.

This package helps! `package-lock-utd` very strictly checks whether `package-lock.json` is up to date. If `npm install` would somehow modify `package-lock.json`, `package-lock-utd` exits with a non-zero exit code.

## Usage

> `package-lock-utd` is primarily meant to be used in CI environments, such as GitHub Actions. However, you can also use it locally.

To run `package-lock-utd`, simply execute the following command in the root directory of your npm project:

```
npx package-lock-utd
```

If `package-lock.json` is up to date, the program will exit with a `0` exit code. If `package-lock.json` is not up to date (or an error occurred), the program will exit with a non-zero exit code.

### Sample GitHub Actions config

```yml
name: Main Checks

on: [push, pull_request, workflow_dispatch]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Check if package-lock.json is up to date
        run: npx package-lock-utd

      # Now, run any command you like. This is just an example.
      - name: Install dependencies
        run: npm ci

      - name: Run the linter
        run: npm run lint
```

> **Warning**  
> Make sure not to run any commands that potentially modify `package-lock.json` (e.g. `npm install`) before executing `npx package-lock-utd`.
