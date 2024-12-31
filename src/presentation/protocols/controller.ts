import { HttpRequest, HttpResponse } from "./http";

export interface Controller {
	sign(httpRequest: HttpRequest): HttpResponse;
}
