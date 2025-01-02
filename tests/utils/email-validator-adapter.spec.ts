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

const makeSut = (): EmailValidatorAdapter => {
	return new EmailValidatorAdapter();
};

describe("EmailValidatorAdapter", () => {
	test("Should return false if validator returns false", () => {
		const sut = makeSut();
		vi.spyOn(validator, "isEmail").mockReturnValueOnce(false);
		const isValid = sut.isValid("invalid_email@email.com");
		expect(isValid).toBe(false);
	});

	test("Should return true if validator retuns true", () => {
		const sut = makeSut();
		const isValid = sut.isValid("valid_email@email.com");
		expect(isValid).toBe(true);
	});

	test("Should call validator with correct email", () => {
		const sut = makeSut();
		const isEmailSpy = vi.spyOn(validator, "isEmail");
		sut.isValid("any@email.com");
		expect(isEmailSpy).toHaveBeenLastCalledWith("any@email.com");
	});
});
