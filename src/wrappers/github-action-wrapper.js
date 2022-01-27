import * as exec from '@actions/exec';

class GithubActionWrapper {
  exec(...args) {
    return exec.exec(...args);
  }
}

export default GithubActionWrapper;
