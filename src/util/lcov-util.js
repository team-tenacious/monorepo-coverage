import { statSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import lcovTotal from 'lcov-total';

const processCwd = process.env.GITHUB_WORKSPACE ?? process.cwd();

class LcovUtil {
  #packageName;
  #root;

  constructor(packageName, root) {
    this.#packageName = packageName;
    this.#root = root;
    statSync(this.#path);
  }

  async exists() {
    try {
      await fs.stat(path.resolve(this.#path, "coverage", "lcov.info"));
      return true;
    } catch(e) {
      return false;
    }
  }

  async generate() {
    try {
      await fs.stat(path.resolve(this.#path, ".nyc_output"));
      await exec.exec('npx nyc report', ["--reporter=lcovonly"], {cwd: this.#path});
    } catch(e) {};
  }

  read() {
    const totalCoverage = lcovTotal(path.resolve(this.#path, "coverage", "lcov.info"), {type: "lcov"});
    return totalCoverage;
  }

  get #path() {
    const packageCwd = path.resolve(processCwd, this.#root, this.#packageName);
    return packageCwd;

  }
}

export default LcovUtil;
