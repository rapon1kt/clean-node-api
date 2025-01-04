import bcrypt from "bcrypt";
import { BcryptAdapter } from "@/infra/cryptography";
import { describe, test, expect, vi } from "vitest";

describe("Bcrypt Adapter", () => {
	test("Should call bcrypt with correct values", async () => {
		const salt = 12;
		const sut = new BcryptAdapter(salt);
		const hashSpy = vi.spyOn(bcrypt, "hash");
		await sut.encrypt("any_value");
		expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
	});
});
