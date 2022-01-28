import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";
import RootRunner from "../../../src/runners/root-runner.js";
import UtilFactory from "../../../src/factories/util-factory.js";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Root runner tests",() => {
  context("getPackagesCoverage",() => {
    afterEach(() => {
      sinon.restore()
    })

    it("Should fail to generate coverage", async() => {
      const mockLcovUtil = {
        exists: sinon.stub(),
        generate: sinon.stub()
      };

      sinon.stub(UtilFactory, "getLcovUtil").returns(mockLcovUtil);
      const instance = new RootRunner("/mock/path", ["mockPackage"]);
      await expect(instance.getPackagesCoverage()).to.eventually.be.rejectedWith("lcov.info not found");
    });
  });
});
