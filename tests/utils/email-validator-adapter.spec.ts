import { EmailValidatorAdapter } from "@/utils/email-validator-adapter";
import { describe, test, expect } from "vitest";

describe("EmailValidatorAdapter", () => {
	test("Should return false if validator returns false", () => {
		const sut = new EmailValidatorAdapter();
		const isValid = sut.isValid("invalid_email@email.com");
		expect(isValid).toBe(false);
	});
});
