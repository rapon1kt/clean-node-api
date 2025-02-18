import express, { Express } from "express";
import setUpMiddlewares from "./middlewares";
import setUpRoutes from "./routes";

export const setUpApp = async (): Promise<Express> => {
	const app = express();
	setUpMiddlewares(app);
	setUpRoutes(app);
	return app;
};
