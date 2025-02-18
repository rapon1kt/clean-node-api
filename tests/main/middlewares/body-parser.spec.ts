import { describe, test } from "vitest";
import { setUpApp } from "@/main/config/app";
import request from "supertest";

describe("BodyParserMiddleware", () => {
	test("Should parse body as json", async () => {
		const app = await setUpApp();
		app.post("/test_body_parser", (req, res) => {
			res.send(req.body);
		});
		await request(app)
			.post("/test_body_parser")
			.send({ name: "Gustavo" })
			.expect({ name: "Gustavo" });
	});
});
