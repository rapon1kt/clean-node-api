import { Account } from "@/domain/models";
import { AddAccount, AddAccountModel } from "@/domain/usecases";
import { SignUpController } from "@/presentation/controllers/";
import {
	InvalidParamError,
	MissingParamError,
	ServerErorr,
} from "@/presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "@/presentation/helpers/http-helper";
import { EmailValidator, HttpRequest } from "@/presentation/protocols";
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

const makeFakeAccount = (): Account => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@email.com",
	password: "valid_password",
});

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		email: "any@email.com",
		password: "any_password",
		passwordConfirmation: "any_password",
	},
});

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<Account> {
			return new Promise((resolve) => resolve(makeFakeAccount()));
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
	test("Should return 400 if no name is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
	});

	test("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
	});

	test("Should return 400 if no password and no passwordConfirmation is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "",
				passwordConfirmation: "",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
	});

	test("Should return 400 if no password is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "",
				passwordConfirmation: "any_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
	});

	test("Should return 400 if no passwordConfirmation is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError("passwordConfirmation"))
		);
	});

	test("Should return 400 if an invalid email is provided", async () => {
		const { sut, emailValidatorStub } = makeSut();
		vi.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
	});

	test("Should call EmailValidator with correct email", async () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = vi.spyOn(emailValidatorStub, "isValid");
		await sut.handle(makeFakeRequest());
		expect(isValidSpy).toHaveBeenCalledWith("any@email.com");
	});

	test("Should return 500 if EmailValidator throws", async () => {
		const { sut, emailValidatorStub } = makeSut();
		vi.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerErorr(null)));
	});

	test("Should return 400 if password confirm fails", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: "any_name",
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "invalid_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(
			badRequest(new InvalidParamError("passwordConfirmation"))
		);
	});

	test("Should call AddAccount with correct values", async () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = vi.spyOn(addAccountStub, "add");
		await sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: "any_name",
			email: "any@email.com",
			password: "any_password",
		});
	});

	test("Should return 500 if AddAccount throws", async () => {
		const { sut, addAccountStub } = makeSut();
		vi.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => reject(new Error()));
		});
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerErorr(null)));
	});

	test("Should return 200 if valid data is provided", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});
});
