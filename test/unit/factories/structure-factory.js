import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

import StructureFactory from "../../../src/factories/structure-factory.js";
import PackageStructure from "../../../src/structures/package-structure.js";


describe("Structure Factory tests", () => {
  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  context("getPackageStructure", () => {

    it("gets a package structure instance", async () => {

      expect(StructureFactory.getPackageStructure("mockPackage", 10))
        .to.be.instanceOf(PackageStructure);
    });
  });

  
});
