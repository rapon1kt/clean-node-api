import { SignUpController } from "@/presentation/controllers/";
import { MissingParamError } from "@/presentation/errors";
import { describe, expect, test } from "vitest";

describe("SingUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("name"));
	});

	test("Should return 400 if no email is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("email"));
	});

	test("Should return 400 if no password and no passwordConfirmation is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "",
				passwordConfirmation: "",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});

	test("Should return 400 if no password is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError("password"));
	});

	test("Should return 400 if no passwordConfirmation is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingParamError("passwordConfirmation")
		);
	});
});
