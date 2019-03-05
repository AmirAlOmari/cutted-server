import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { Response } from "superagent";
import config from "../../../../mocha.config";

chai.use(chaiHttp);
const url = `${config.server.address}:${config.server.port}`;
const req = chai.request(`${url}`);

describe("Users", () => {
	// cutted
});
