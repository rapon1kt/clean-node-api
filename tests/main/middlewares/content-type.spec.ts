import { describe, test } from "vitest";
import { setUpApp } from "@/main/config/app";
import request from "supertest";

describe("Content Type Middleware", () => {
	test("Should return default content type as json", async () => {
		const app = await setUpApp();
		app.get("/test_content_type", (req, res) => {
			res.send("");
		});
		await request(app).get("/test_content_type").expect("content-type", /json/);
	});

	test("Should return xml content type when forced", async () => {
		const app = await setUpApp();
		app.get("/test_content_type_xml", (req, res) => {
			res.type("xml");
			res.send("");
		});
		await request(app)
			.get("/test_content_type_xml")
			.expect("content-type", /xml/);
	});
});
