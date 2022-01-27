import PackageStructure from "../structures/package-structure.js";

class StructureFactory {
  static getPackageStructure(packageName, coveragePercentage) {
    return new PackageStructure(packageName, coveragePercentage);
  }
}

export default StructureFactory;
