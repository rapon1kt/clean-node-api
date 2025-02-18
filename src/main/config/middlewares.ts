import express, { Express } from "express";
import { cors, contentType, bodyParsed } from "../middlewares";

export default (app: Express): void => {
	app.use(express.json());
	app.use(bodyParsed);
	app.use(cors);
	app.use(contentType);
};
