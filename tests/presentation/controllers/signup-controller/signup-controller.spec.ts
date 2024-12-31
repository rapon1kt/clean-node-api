import { SignUpController } from "@/presentation/controllers/";
import { describe, expect, test } from "vitest";

describe("SingUp Controller", () => {
	test("Should return 400 if no body is provided", () => {
		const sut = new SignUpController();
		const httpRequest = {
			body: undefined,
		};
		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});
});
