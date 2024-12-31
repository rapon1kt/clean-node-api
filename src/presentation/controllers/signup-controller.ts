type HttpRequest = {
	body: {
		name: string;
		password: string;
		passwordConfirmation: string;
		email: string;
	};
};

export default class SignUpController {
	handle(httpRequest: HttpRequest): any {
		if (!httpRequest.body) {
			return {
				statusCode: 400,
			};
		}
	}
}
