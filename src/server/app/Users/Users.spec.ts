import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import config from "../../../../tests/config";

chai.use(chaiHttp);
const url = `${config.server.address}:${config.server.port}`;
const req = chai.request(`${url}`);

describe("Users", () => {
	it("should be OK", () => {
		expect(true).to.equal(true);
	});
	// cutted
});
