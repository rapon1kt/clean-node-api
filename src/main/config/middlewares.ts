import { Express } from "express";
import { bodyParsed, cors, contentType } from "../middlewares";

export default (app: Express): void => {
	app.use(bodyParsed);
	app.use(cors);
	app.use(contentType);
};
