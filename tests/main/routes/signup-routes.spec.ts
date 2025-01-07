import request from "supertest";
import app from "@/main/config/app";
import { describe, test } from "vitest";

describe("SignUp Routes", () => {
	test("Should return an account on success", async () => {
		await request(app)
			.post("/api/signup")
			.send({
				name: "Gustavo",
				email: "raponikt@gmail.com",
				password: "123",
				passwordConfirmation: "123",
			})
			.expect(200);
	});
});
