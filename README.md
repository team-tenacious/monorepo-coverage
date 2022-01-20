# monorepo-coverage
GitHub Action to generate coverage for all projects in a monorepo

## Why ?
We spent weeks looking and working on solutions to facilitate viewing our monorepo coverage
files as badges on our project and got frustrated at the lack of trivial Actions which focus
on this task specifically.

So we built a task which (at this moment) requires you only to specify a root package directory,
and a list of packages to be included in the coverage. This Action generates JSON files
containing the total coverage of each project as well as a shields.io badge which you
can embed into the README of the project.

## How ?
We've used JavaScript Actions to build this, using Node's ESM support. Coverage is generated
using NYC (if there is no `coverage/lcov.info` file available) and parsed using lcov-total.
Axios is used to download the badge from shields.io, and then we use a bunch of Git commands
to create a new branch, add, commit, and push (thanks to [add-and-commit by EndBug](https://github.com/EndBug/add-and-commit))

# Usage
NOTE: This action requires you run coverage on your monorepo.

Create a step like this to your workflow:
```yaml
- uses: team-tenacious/monorepo-coverage@main # You can change this to use a specific version.
  with:
    # The token used to authenticate this github actor
    GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"

    # The name of the branch that will be created to store coverage information in
    # Default: coverage
    COVERAGE_BRANCH: platform-coverage

    # The root of your packages
    # Default: .
    ROOT: src/packages

    # A list of comma-separated package names to fetch coverage from
    # Commas can be separated using backslashes
    # Required when specifying ROOT input
    PACKAGES: "ui-server,backend-server,inform\\,diagnose-and-repair-service"
```

This is a live action .yml using
Monorepo Coverage with all of its options in use:
```yaml
name: Create Coverage branch

on:
  push:
    branches: [ main, develop ]
    paths:
      - "security-server/**"
      - "ui-server/**"
      - "backend-server/**"
  pull_request:
    branches: [ main, develop ]
    paths:
      - "security-server/**"
      - "ui-server/**"
      - "backend-server/**"

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}

    - name: Setup NVM
      shell: bash -l {0}
      run: |
        nvm install 14
        nvm install 16
        nvm use 16

    - name: Install dependencies
      run: npm install

    - name: Run tests + generate coverage
      run: yarn coverage

    - name: Generate coverage branch
      uses: team-tenacious/monorepo-coverage@main
      with:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
        COVERAGE_BRANCH: platform-coverage
        ROOT: "."
        PACKAGES: ui-server,backend-server,security-server
```
