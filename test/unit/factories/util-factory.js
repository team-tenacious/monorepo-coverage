import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

import LcovFactory from "../../../src/factories/util-factory.js";
import LcovUtil from "../../../src/utils/lcov-util.js";


describe("Util Factory tests", () => {
  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  context("getLcovUtil", () => {

    it("gets an lcov util instance", async () => {
      mockFs({
        "/mock/path/mockPackage": {}
      });

      expect(LcovFactory.getLcovUtil("mockPackage", "/mock/path"))
        .to.be.instanceOf(LcovUtil);
    });
  });

  
});
