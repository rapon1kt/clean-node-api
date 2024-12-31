import {
	HttpRequest,
	HttpResponse,
	Controller,
	EmailValidator,
} from "../protocols";
import { badRequest } from "../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../errors";

export default class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	sign(httpRequest: HttpRequest): HttpResponse {
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
	}
}
