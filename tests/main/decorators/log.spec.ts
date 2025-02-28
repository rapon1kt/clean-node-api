import { describe, expect, test, vi } from "vitest";
import { LogControllerDecorator } from "@/main/decorators/log";
import {
	Controller,
	HttpRequest,
	HttpResponse,
} from "@/presentation/protocols";
import { LogErrorRepository } from "@/data/protocols/log-error-repository";
import { serverError } from "@/presentation/helpers/http-helper";

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {
					name: "Rodrigo",
				},
			};
			return new Promise((resolve) => resolve(httpResponse));
		}
	}
	return new ControllerStub();
};

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepositoryStub {
		async log(stack: string): Promise<void> {
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

describe("LogController Decorator", () => {
	test("Should call controller handle", async () => {
		const { sut, controllerStub } = makeSut();
		const handleSpy = vi.spyOn(controllerStub, "handle");
		const httpRequest = {
			body: {
				email: "any_mail@mail.com",
				name: "any_name",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});

	test("Should return the same value of controller", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "any@email.com",
				password: "any_password",
				passwordConfirmation: "any_password",
				name: "any_name",
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: "Rodrigo",
			},
		});
	});

	test("Should call LogRepository with correct error if controller returns a server error", async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const fakeError = new Error();
		fakeError.stack = "any_stack";
		const error = serverError(fakeError);
		const logSpy = vi.spyOn(logErrorRepositoryStub, "log");
		vi.spyOn(controllerStub, "handle").mockReturnValueOnce(
			new Promise((resolve) => resolve(error))
		);
		const httpRequest = {
			body: {
				email: "any_mail@mail.com",
				name: "any_name",
				password: "any_password",
				passwordConfirmation: "any_password",
			},
		};
		await sut.handle(httpRequest);
		expect(logSpy).toHaveBeenCalledWith("any_stack");
	});
});
