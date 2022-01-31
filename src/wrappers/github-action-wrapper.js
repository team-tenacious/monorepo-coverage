import * as exec from '@actions/exec';

class GithubActionWrapper {
  /* c8 ignore next 3 */
  exec(...args) {
    return exec.exec(...args);
  }
}

export default GithubActionWrapper;
