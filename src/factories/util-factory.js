import LcovUtil from "../util/lcov-util.js";

class UtilFactory {
  static getLcovUtil(packageName, root) {
    return new LcovUtil(packageName, root);
  }
}

export default UtilFactory;
