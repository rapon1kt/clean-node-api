import {
	HttpRequest,
	HttpResponse,
	Controller,
	EmailValidator,
} from "../protocols";
import { badRequest } from "../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../errors";
import { ServerErorr } from "../errors/server-error";

export default class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	sign(httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredFields = [
				"name",
				"email",
				"password",
				"passwordConfirmation",
			];
			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}
			const isValid = this.emailValidator.isValid(httpRequest.body.email);
			if (!isValid) {
				return badRequest(new InvalidParamError("email"));
			}
		} catch (error) {
			return {
				statusCode: 500,
				body: new ServerErorr(),
			};
		}
	}
}
