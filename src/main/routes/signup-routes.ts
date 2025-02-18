import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/signup-factorie";

export default (router: Router): void => {
	router.post("/signup", adaptRoute(makeSignUpController()));
};
