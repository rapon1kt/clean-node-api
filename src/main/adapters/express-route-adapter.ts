import { Controller, HttpRequest } from "@/presentation/protocols";
import { Response, Request } from "express";

export const adaptRoute = (controller: Controller) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
			body: req.body,
		};
		console.log(httpRequest.body);
		const httpResponse = await controller.sign(httpRequest);
		res.status(httpResponse.statusCode).json(httpResponse.body);
	};
};
