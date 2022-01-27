import LcovUtil from "../utils/lcov-util.js";
import GithubActionWrapper from "../wrappers/github-action-wrapper.js";

class UtilFactory {
  static getLcovUtil(packageName, root) {
    return new LcovUtil(packageName, root, new GithubActionWrapper());
  }
}

export default UtilFactory;
