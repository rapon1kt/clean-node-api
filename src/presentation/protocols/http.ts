export interface HttpRequest {
	body: {
		name: string;
		email: string;
		password: string;
		passwordConfirmation: string;
	};
}

export interface HttpResponse {
	statusCode: number;
	body?: any;
}
