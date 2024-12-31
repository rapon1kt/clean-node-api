import { HttpRequest, HttpResponse } from "@/presentation/protocols/http";

export default class SignUpController {
	sign(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body) {
			return {
				statusCode: 400,
			};
		} else if (!httpRequest.body.name || !httpRequest.body.email) {
			return {
				statusCode: 400,
			};
		} else if (
			!httpRequest.body.password ||
			!httpRequest.body.passwordConfirmation
		) {
			return {
				statusCode: 400,
			};
		}
	}
}
