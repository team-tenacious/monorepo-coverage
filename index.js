import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import fs from "fs/promises";
import path from 'path';
import lcovTotal from 'lcov-total';
import axios from 'axios';

const processCwd = process.env.GITHUB_WORKSPACE ?? process.cwd();

const checkForLcovInfo = async (cwd) => {
  try {
    await fs.stat(path.resolve(cwd, "coverage", "lcov.info"));
    return true;
  } catch(e) {
    return false;
  }
}

const rootExclusive = async (root) => {
  const workspacePackages = core.getInput(
    'PACKAGES', { required: true, trimWhitespace: true }
  )?.split(/(?<!(?:$|[^\\])(?:\\\\)*?\\),/).map(item => item.replace("\\,", ","));

  const coverages = [];

  for (const workspacePackage of workspacePackages) {
    await fs.stat(processCwd, root, workspacePackage);
    const packageCwd = path.resolve(processCwd, root, workspacePackage);

    if (!await checkForLcovInfo(packageCwd)) {
      try {
        await fs.stat(path.resolve(processCwd, root, workspacePackage, ".nyc_output"));
        await exec.exec('npx nyc report', ["--reporter=lcovonly"], {cwd: path.resolve(processCwd, root, workspacePackage)});
      } catch(e) {}

      if (!await checkForLcovInfo(packageCwd)) {
        throw new Error("lcov.info not found");
      }
    }

    const totalCoverage = lcovTotal(path.resolve(packageCwd, "coverage", "lcov.info"), {type: "lcov"});
    coverages.push({ workspacePackage, coverageSummary: { totalCoverage } });
  }

  return coverages;
}

async function downloadImage(url, filepath) {
  const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
  });

  const data = response.data;
  await fs.writeFile(filepath, data);
}

const runAction = async () => {
  try {
    const root = core.getInput('ROOT', { required: true, trimWhitespace: true }) || ".";
    const coverages = await rootExclusive(root);

    const coverageBranch = core.getInput("COVERAGE_BRANCH", { required: false, trimWhitespace: true });
    if (coverageBranch !== "") {
      const token = core.getInput("GITHUB_TOKEN", { required: true, trimWhitespace: true });

      const originalBranch = process.env.GITHUB_REF_NAME;
      const latestCommitId = process.env.GITHUB_SHA;

      const oldPath = path.resolve(originalBranch, "old", latestCommitId);
      const latestPath = path.resolve(originalBranch, "latest");

      const getJson = (filePath, packageName) => path.resolve(filePath, packageName + ".total.json");
      const getBadge = (filePath, packageName) => path.resolve(filePath, packageName + ".badge.svg");

      try {
        await exec.exec("git stash");
      } catch(e) {}

      try {
        await exec.exec("git switch", [coverageBranch]);
      } catch(e) {
        await exec.exec("git switch", ["--orphan", coverageBranch]);
      }

      try {
        await exec.exec("git pull", ["origin", coverageBranch]);
      } catch(e) {}

      await io.mkdirP(oldPath).catch(() => {});
      await io.rmRF(path.resolve(latestPath, "*")).catch(() => {});
      await io.mkdirP(latestPath).catch(() => {});

      for (const {workspacePackage, coverageSummary}  of coverages) {
        await fs.writeFile(getJson(oldPath, workspacePackage), JSON.stringify(coverageSummary, null, 2));
        await fs.writeFile(getJson(latestPath, workspacePackage), JSON.stringify(coverageSummary, null, 2));

        await downloadImage(
          `https://img.shields.io/badge/${workspacePackage.replaceAll("-", "--")}-${coverageSummary.totalCoverage}%25-brightgreen`,
          getBadge(latestPath, workspacePackage)
        );

        await exec.exec("cp", [getBadge(latestPath, workspacePackage), getBadge(oldPath, workspacePackage)]);

        await exec.exec("git add", [getJson(oldPath, workspacePackage)]);
        await exec.exec("git add", [getBadge(oldPath, workspacePackage)]);
        await exec.exec("git add", [getJson(latestPath, workspacePackage)]);
        await exec.exec("git add", [getBadge(latestPath, workspacePackage)]);
      }

      await exec.exec("git config", ["http.sslVerify", false]);
      await exec.exec("git config", ["--local", "user.email", "github-actions[bot]@users.noreply.github.com"]);
      await exec.exec("git config", ["--local", "user.name", "github-actions[bot]"]);

      await exec.exec("git commit", ["-nm", "autogenerated coverage"]);

      await exec.exec("git push", [`https://${process.env.GITHUB_ACTOR}:${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`]);

      await exec.exec("git switch", [originalBranch]);

      try {
        await exec.exec("git stash pop");
      } catch(e) {}
    }

    core.setOutput("COVERAGE", JSON.stringify(coverages));
  } catch (error) {
    console.log(error.stack);
    core.setFailed(error.message);
  }
}

if (!process.env.GITHUB_REF.startsWith("refs/pull")) {
  await runAction();
}
