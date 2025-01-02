import { Account } from "@/domain/models";
import { AddAccount, AddAccountModel } from "@/domain/usecases";
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
	addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		add(account: AddAccountModel): Account {
			const fakeAccount = {
				id: "valid_id",
				name: "valid_name",
				email: "valid_email@email.com",
				password: "valid_password",
			};
			return fakeAccount;
		}
	}
	return new AddAccountStub();
};

const makeSut = (): sutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const sut = new SignUpController(emailValidatorStub, addAccountStub);
	return {
		sut,
		emailValidatorStub,
		addAccountStub,
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
		const { sut, emailValidatorStub } = makeSut();
		vi.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});
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

	test("Should return 400 if password confirm fails", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "invalid_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError("passwordConfirmation")
		);
	});

	test("Should call AddAccount with correct values", () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = vi.spyOn(addAccountStub, "add");
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any_email@mail.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		sut.sign(httpRequest);
		expect(addSpy).toHaveBeenCalledWith({
			id: "192837645123",
			name: "any_name",
			email: "any_email@mail.com",
			password: "any_password",
		});
	});

	test("Should return 500 if AddAccount throws", () => {
		const { sut, addAccountStub } = makeSut();
		vi.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
			throw new Error();
		});
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerErorr());
	});

	test("Should return 200 if valid data is provided", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = sut.sign(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toEqual({
			id: "valid_id",
			name: "valid_name",
			email: "valid_email@email.com",
			password: "valid_password",
		});
	});
});
