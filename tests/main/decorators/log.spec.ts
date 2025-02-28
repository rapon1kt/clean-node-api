import { describe, expect, test, vi } from "vitest";
import { LogControllerDecorator } from "@/main/decorators/log";
import {
	Controller,
	HttpRequest,
	HttpResponse,
} from "@/presentation/protocols";
import { LogErrorRepository } from "@/data/protocols/log-error-repository";
import { ok, serverError } from "@/presentation/helpers/http-helper";
import { Account } from "@/domain/models";

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			return new Promise((resolve) => resolve(ok(makeFakeAccount())));
		}
	}
	return new ControllerStub();
};

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepositoryStub {
		async logError(stack: string): Promise<void> {
			return new Promise((resolve) => resolve());
		}
	}
	return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const logErrorRepositoryStub = makeLogErrorRepositoryStub();
	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	);
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub,
	};
};

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		email: "any@email.com",
		password: "any_password",
		passwordConfirmation: "any_password",
	},
});

const makeFakeAccount = (): Account => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@mail.com",
	password: "valid_password",
});

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = "any_stack";
	return serverError(fakeError);
};

describe("LogController Decorator", () => {
	test("Should call controller handle", async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = vi.spyOn(controllerStub, "handle");
		await sut.handle(makeFakeRequest());
		expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
	});

	test("Should return the same value of controller", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok(makeFakeAccount()));
	});

	test("Should call LogRepository with correct error if controller returns a server error", async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const logSpy = vi.spyOn(logErrorRepositoryStub, "logError");
		vi.spyOn(controllerStub, "handle").mockReturnValueOnce(
			new Promise((resolve) => resolve(makeFakeServerError()))
		);
		await sut.handle(makeFakeRequest());
		expect(logSpy).toHaveBeenCalledWith("any_stack");
	});
});
