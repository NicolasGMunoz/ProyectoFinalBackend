import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import configs from "../../../src/config.js";
import { conn } from "../../../src/dao/factory.js";

const PORT = configs.port;
const requester = supertest(`http://localhost:${PORT}`);

// console.log(configs.mongoUrl)
let cookie

describe("Pruebas de integración del módulo de sessions", () => {
	after(async () => {
		try {
			await conn.connection.collections?.users?.drop();
			await conn.connection.collections?.sessions?.drop();
		} catch (error) {
			console.log(error.message);
		}
	});

	it("POST /api/sessions/register Se debe registar un usuario correctamente", async () => {
		const userMock = {
			first_name: "Nicolás",
			last_name: "Muñoz",
			email: "nicolasgustavomunoz@gmail.com",
			age: 28,
			password: "Coder1234"
		};
		const { statusCode, _body } = await requester
			.post("/api/sessions/register")
			.send(userMock);
		// console.log(_body.payload);
		expect(statusCode).to.be.eql(201);
		expect(_body.payload).to.have.property("first_name");
		expect(_body.payload).to.have.property("last_name");
		expect(_body.payload).to.have.property("email");
		expect(_body.payload).to.have.property("age");

		expect(_body.payload.first_name).to.be.eql("Nicolás");
		expect(_body.payload.last_name).to.be.eql("Muñoz");
		expect(_body.payload.email).to.be.eql("nicolasgustavomunoz@gmail.com");
	});

	it("POST /api/sessions/login Se debe loguear al usuario de forma exitosa y retornar el token", async () => {
		const credentials = {
			email: "nicolasgustavomunoz@gmail.com",
			password: "Coder1234"
		};
		const loginResult = await requester
			.post("/api/sessions/login")
			.send(credentials);
		// console.log(loginResult)
		const { statusCode, _body } = loginResult;

		expect(statusCode).to.be.eql(200);

		const cookieResult = loginResult.headers["set-cookie"][0];
		// console.log(cookieResult);
		expect(cookieResult).to.be.ok;

		const cookieResultSplit = cookieResult.split("=");
		cookie = {
			name: cookieResultSplit[0],
			value: cookieResultSplit[1]
		};
		// console.log(cookie)
		expect(cookie.name).to.be.ok.and.to.be.eql("coderCookieToken");
		expect(cookie.value).to.be.ok;
	});
});