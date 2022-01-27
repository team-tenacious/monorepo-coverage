import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

import PackageStructure from "../../../src/structures/package-structure.js";

describe("Package Structure tests", () => {
  context("badge", () => {
    it("generates a path to where coverage badge should be stored", () => {
      const instance = new PackageStructure("mockPackage", 89);
      expect(instance.badge("/mock/path")).to.equal("/mock/path/mockPackage.badge.svg");
    });
  });

  context("json", () => {
    it("generates a path to where coverage json should be stored", () => {
      const instance = new PackageStructure("mockPackage", 89);
      expect(instance.json("/mock/path")).to.equal("/mock/path/mockPackage.total.json");
    });
  });

  context("name", () => {
    it("retrieves the package name", () => {
      const instance = new PackageStructure("mockPackage", 89);
      expect(instance.name).to.equal("mockPackage");
    });
  });

  context("coverage", () => {
    it("retrieves the package total coverage", () => {
      const instance = new PackageStructure("mockPackage", 89);
      expect(instance.coverage).to.be.an("object")
        .which.has.ownProperty("totalCoverage")
        .which.equals(89);
    });
  });
});
