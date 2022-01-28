import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import mockFs from "mock-fs";
import sinon from "sinon";

chai.use(sinonChai);
chai.use(chaiAsPromised);

import RunnerFactory from "../../../src/factories/runner-factory.js";
import RootRunner from "../../../src/runners/root-runner.js";


describe("Runner Factory tests", () => {
  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  context("getRootRunner", () => {

    it("gets a root runner instance", async () => {

      expect(RunnerFactory.getRootRunner("/mock/path", []))
        .to.be.instanceOf(RootRunner);
    });
  });

  
});
