import RootRunner from "../runners/root-runner.js";

class RunnerFactory {
  static getRootRunner(root, packages) {
    return new RootRunner(root, packages);
  }
}

export default RunnerFactory;
