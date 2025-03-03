import { Router, Express } from "express";
import * as fg from "fast-glob";

export default (app: Express): void => {
	const router = Router();
	app.use("/api", router);
	fg.sync("**/src/main/routes/**routes.ts").map(async (file) =>
		(await import(`../../../${file}`)).default(router)
	);
};
