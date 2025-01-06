import bcrypt from "bcrypt";
import { BcryptAdapter } from "@/infra/cryptography";
import { describe, test, expect, vi } from "vitest";

const salt = 12;
const makeSut = (): BcryptAdapter => {
	return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
	test("Should call bcrypt with correct values", async () => {
		const sut = makeSut();
		const hashSpy = vi.spyOn(bcrypt, "hash");
		await sut.encrypt("any_value");
		expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
	});
});
