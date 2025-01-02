import { EmailValidatorAdapter } from "@/utils/email-validator-adapter";
import { describe, test, expect, vi } from "vitest";
import validator from "validator";

vi.mock("validator", async (importOriginal) => {
	return {
		...(await importOriginal<typeof import("validator")>()),
		isEmail(): boolean {
			return true;
		},
	};
});

describe("EmailValidatorAdapter", () => {
	test("Should return false if validator returns false", () => {
		const sut = new EmailValidatorAdapter();
		vi.spyOn(validator, "isEmail").mockReturnValueOnce(false);
		const isValid = sut.isValid("invalid_email@email.com");
		expect(isValid).toBe(false);
	});

	test("Should return true if validator retuns true", () => {
		const sut = new EmailValidatorAdapter();
		const isValid = sut.isValid("valid_email@email.com");
		expect(isValid).toBe(true);
	});
});
