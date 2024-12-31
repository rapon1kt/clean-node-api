import { HttpRequest, HttpResponse } from "@/presentation/protocols/http";
import { badRequest } from "../helpers/http-helper";
import { MissingParamError } from "../errors";

export default class SignUpController {
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
	}
}
