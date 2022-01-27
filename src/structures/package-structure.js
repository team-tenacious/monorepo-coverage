class PackageStructure {
  #packageName;
  #coverage;

  constructor(packageName, coverage) {
    this.#packageName = packageName;
    this.#coverage = coverage;
  }

  badge(folderPath) {
    return path.resolve(folderPath, `${this.#packageName}.badge.svg`);
  }

  json(folderPath) {
    return path.resolve(folderPath, `${this.#packageName}.total.json`);
  }

  get name() {
    return this.#packageName;
  }

  get coverage() {
    return { totalCoverage: this.#coverage };
  }
}

export default PackageStructure;
