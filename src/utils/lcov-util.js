import { statSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import lcovTotal from 'lcov-total';

const processCwd = process.env.GITHUB_WORKSPACE ?? process.cwd();
console.log(processCwd);

class LcovUtil {
  #packageName;
  #root;
  #actionWrapper;

  constructor(packageName, root, actionWrapper) {
    this.#packageName = packageName;
    this.#root = root;
    this.#actionWrapper = actionWrapper;

    try {
      statSync(this.#path);
    } catch(e) {
      throw new Error(`Package does not exist: ${this.#root}/${this.#packageName}`)
    }
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
      await this.#actionWrapper.exec('npx nyc report', ["--reporter=lcovonly"], {cwd: this.#path});
    } catch(e) {
      console.debug("Error occurred while generating coverage - ignoring")
    };
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
