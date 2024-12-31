import { SignUpController } from "@/presentation/controllers/";
import { InvalidParamError, MissingParamError } from "@/presentation/errors";
import { EmailValidator } from "@/presentation/protocols";
import { describe, expect, test, vi } from "vitest";

interface sutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
}

const makeSut = (): sutTypes => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	const emailValidatorStub = new EmailValidatorStub();
	const sut = new SignUpController(emailValidatorStub);
	return {
		sut,
		emailValidatorStub,
	};
};

describe("SingUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		const { sut } = makeSut();
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
		const { sut } = makeSut();
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
		const { sut } = makeSut();
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
		const { sut } = makeSut();
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
		const { sut } = makeSut();
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

	test("Should return 400 if an invalid email is provided", () => {
		const { sut, emailValidatorStub } = makeSut();
		vi.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const httpRequest = {
			body: {
				name: "any_name",
				email: "invalid_email@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError("email"));
	});
});
