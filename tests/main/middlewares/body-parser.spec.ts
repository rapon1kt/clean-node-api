import { describe, test } from "vitest";
import app from "@/main/config/app";
import request from "supertest";

describe("BodyParserMiddleware", () => {
	test("Should parse body as json", async () => {
		app.post("/test_body_parser", (req, res) => {
			res.send(req.body);
		});
		await request(app)
			.post("/test_body_parser")
			.send({ name: "Gustavo" })
			.expect({ name: "Gustavo" });
	});
});
