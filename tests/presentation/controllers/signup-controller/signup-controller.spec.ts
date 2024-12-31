import { SignUpController } from "@/presentation/controllers/";
import {
	InvalidParamError,
	MissingParamError,
	ServerErorr,
} from "@/presentation/errors";
import { EmailValidator } from "@/presentation/protocols";
import { describe, expect, test, vi } from "vitest";

interface sutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeEmailValidatorWithError = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			throw new Error();
		}
	}
	return new EmailValidatorStub();
};

const makeSut = (): sutTypes => {
	const emailValidatorStub = makeEmailValidator();
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

	test("Should call EmailValidator with correct email", () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = vi.spyOn(emailValidatorStub, "isValid");
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		sut.sign(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith("any@email.com");
	});

	test("Should return 500 if EmailValidator throws", () => {
		const emailValidatorStub = makeEmailValidatorWithError();
		const sut = new SignUpController(emailValidatorStub);
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@mail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerErorr());
	});
});
