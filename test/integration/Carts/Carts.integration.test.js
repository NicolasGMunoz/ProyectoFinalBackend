import supertest from "supertest"
import { expect } from "chai"
import { conn } from "../../../src/dao/factory.js";

import configs from "../../../src/config.js"

const PORT = configs.port
const requester = supertest(`http://localhost:${PORT}`)

let cookie


describe("Pruebas de integración módulo de Carts", () => {
	after(async () => {
		try {
			await conn.connection.collections?.users?.drop();
			await conn.connection.collections?.products?.drop();
			await conn.connection.collections?.carts?.drop();
			await conn.connection.collections?.sessions?.drop();
		} catch (error) {
			console.log(error.message);
		}
	});

  before( async () => {
    const userMock = {
			first_name: "Juan",
			last_name: "Perez",
			email: "juanperez@gmail.com",
      age: 30,
			password: "123456ABC"
		};

    const credentials = {
      email: userMock.email,
      password: userMock.password
    }

		await requester.post("/api/sessions/register").send(userMock);
    const loginResult = await requester.post("/api/sessions/login").send(credentials)

    const cookieResult = loginResult.headers["set-cookie"][0];
		const cookieResultSplit = cookieResult.split("=");
		cookie = {
			name: cookieResultSplit[0],
			value: cookieResultSplit[1]
		};

  })

  it("POST de /api/carts para crear un cart en la base de datos", async () => {

		const { statusCode, _body } = await requester
			.post("/api/carts/").set("Cookie", [`${cookie.name}=${cookie.value}`]);

		expect(statusCode).to.be.eql(201);
		expect(_body.payload).to.have.property("_id");
		expect(_body.payload).to.have.property("products");
		expect(Array.isArray(_body.payload.products)).to.be.eql(true)
		expect(_body.payload.products.length).to.be.eql(0)


	});
})