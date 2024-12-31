import { SignUpController } from "@/presentation/controllers/";
import { describe, expect, test } from "vitest";

describe("SingUp Controller", () => {
	test("Should return 400 if no body is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: undefined,
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

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
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
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
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});
});
