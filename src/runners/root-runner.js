import StructureFactory from "../factories/structure-factory.js";
import UtilFactory from "../factories/util-factory.js";

class RootRunner {
  #root;
  #wspackages;

  constructor(root, wspackages) {
    this.#root = root;
    this.#wspackages = wspackages;
  }

  async getPackagesCoverage() {
    const packageCoverage = [];

    for (const wspackageName of this.#wspackages) {
      const totalCoverage = await this.#getTotalCoverage(wspackageName);
      const wspackage = StructureFactory.getPackageStructure(wspackageName, totalCoverage);
      packageCoverage.push(wspackage);
    }

    return packageCoverage;
  }

  async #getTotalCoverage(wspackageName) {
    const lcov = UtilFactory.getLcovUtil(wspackageName, this.#root);

    if (!await lcov.exists()) {
      await lcov.generate();

      if (!await lcov.exists()) {
        throw new Error("lcov.info not found");
      }
    }

    return lcov.read();
  }
}

export default RootRunner;
