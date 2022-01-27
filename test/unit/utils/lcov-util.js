import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

import LcovUtil from "../../../src/utils/lcov-util.js";

const mockLcovFile = (
  "TN:\n" +
  "SF:lib/factories/stream-parser-factory.js\n" +
  "FN:4,(anonymous_0)\n" +
  "FN:9,(anonymous_1)\n" +
  "FNF:2\n" +
  "FNH:2\n" +
  "FNDA:2,(anonymous_0)\n" +
  "FNDA:2,(anonymous_1)\n" +
  "DA:1,1\n" +
  "DA:3,1\n" +
  "DA:5,2\n" +
  "DA:10,2\n" +
  "DA:11,1\n" +
  "DA:13,1\n" +
  "LF:6\n" +
  "LH:6\n" +
  "BRDA:10,0,0,1\n" +
  "BRDA:10,0,1,1\n" +
  "BRF:2\n" +
  "BRH:2\n" +
  "end_of_record\n"
);

describe("Lcov Util tests", () => {
  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  context("constructor", () => {
    it("fails to find package directory in root", async () => {
      mockFs({
        "/mock/path": {}
      });

      expect(() => new LcovUtil("mockPackage", "/mock/path"))
        .to.throw("Package does not exist: /mock/path/mockPackage");
    });

    it("finds the package directory in root", async () => {
      mockFs({
        "/mock/path/mockPackage": {}
      });

      expect(() => new LcovUtil("mockPackage", "/mock/path"))
        .to.not.throw("Package does not exist: /mock/path/mockPackage");
    });
  });

  context("exists", () => {
    it("returns true when lcov.info exists", async () => {
      mockFs({
        "/mock/path/mockPackage": {
          coverage: {
            "lcov.info": mockLcovFile
          }
        }
      });

      const instance = new LcovUtil("mockPackage", "/mock/path");

      await expect(instance.exists()).to.eventually.be.true;
    });

    it("returns false when lcov.info doesn't exist", async () => {
      mockFs({
        "/mock/path/mockPackage": {}
      });

      const instance = new LcovUtil("mockPackage", "/mock/path");

      await expect(instance.exists()).to.eventually.be.false;
    });
  });

  context("generate", () => {
    it("fails to generate coverage from a non-existant nyc output directory", async () => {
      mockFs({
        "/mock/path/mockPackage/": {}
      });

      const execStub = sinon.stub();
      const debugSpy = sinon.stub(console, "debug");

      const instance = new LcovUtil("mockPackage", "/mock/path", { exec: execStub });

      await expect(instance.generate()).to.eventually.not.be.rejected;
      expect(execStub).to.not.have.been.called;
      expect(debugSpy).to.have.been.calledOnceWithExactly("Error occurred while generating coverage - ignoring");
    });

    it("generates coverage from an nyc output directory", async () => {
      mockFs({
        "/mock/path/mockPackage/.nyc_output": {}
      });

      const execStub = sinon.stub();

      const instance = new LcovUtil("mockPackage", "/mock/path", { exec: execStub });

      await expect(instance.generate()).to.eventually.not.be.rejected;
      expect(execStub).to.been.calledOnceWith(
        'npx nyc report', ["--reporter=lcovonly"], {cwd: "/mock/path/mockPackage"}
      );
    });
  });

  context("read", () => {
    it("reads the lcov file", async () => {
      mockFs({
        "/mock/path/mockPackage": {
          coverage: {
            "lcov.info": mockLcovFile
          }
        }
      });

      const instance = new LcovUtil("mockPackage", "/mock/path");

      expect(instance.read()).to.be.a("number").that.equals(100);
    });
  });
});
