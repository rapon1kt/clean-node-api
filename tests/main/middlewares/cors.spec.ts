import request from "supertest";
import app from "@/main/config/app";
import { describe, test } from "vitest";

describe("CORS Middlewares", () => {
	test("Should enable CORS", async () => {
		app.get("/test_cors", (req, res) => {
			res.send();
		});
		await request(app)
			.get("/test_cors")
			.expect("access-control-allow-origin", "*")
			.expect("access-control-allow-methods", "*")
			.expect("access-control-allow-headers", "*");
	});
});
