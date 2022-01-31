import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";
import RootRunner from "../../../src/runners/root-runner.js";
import UtilFactory from "../../../src/factories/util-factory.js";
import StructureFactory from "../../../src/factories/structure-factory.js";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Root runner tests",() => {
  afterEach(() => {
    sinon.restore()
  })

  context("getPackagesCoverage",() => {
    it("fails to generate coverage", async() => {
      const mockLcovUtil = {
        exists: sinon.stub(),
        generate: sinon.stub()
      };

      sinon.stub(UtilFactory, "getLcovUtil").returns(mockLcovUtil);
      const instance = new RootRunner("/mock/path", ["mockPackage"]);
      await expect(instance.getPackagesCoverage()).to.eventually.be.rejectedWith("lcov.info not found");
    });

    it("generates coverage successfully", async () => {
      const mockGetPackageStructure = sinon.stub(StructureFactory, "getPackageStructure").returns("mock package structure");

      const mockLcovUtil = {
        exists: sinon.stub().onSecondCall().returns(true),
        generate: sinon.stub(),
        read: sinon.stub().returns(10)
      };

      sinon.stub(UtilFactory, "getLcovUtil").returns(mockLcovUtil);

      const instance = new RootRunner("/mock/path", ["mockPackage"]);
      await expect(instance.getPackagesCoverage())
        .to.eventually.be.an("array")
        .which.has.members(["mock package structure"]);

      expect(mockGetPackageStructure).to.have.been.calledOnceWithExactly("mockPackage", 10);
    });
  });
});
