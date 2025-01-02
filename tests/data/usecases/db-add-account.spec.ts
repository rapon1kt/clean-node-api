import { DbAddAccount } from "@/data/usecases/db-add-account";
import { describe, expect, test, vi } from "vitest";
import { Encrypter } from "../protocols/encrypter";

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(value: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_password"));
		}
	}
	return new EncrypterStub();
};

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter();
	const sut = new DbAddAccount(encrypterStub);

	return {
		sut,
		encrypterStub,
	};
};

describe("DbAddAccount", () => {
	test("Should call Encrypter with correct password", async () => {
		const { sut, encrypterStub } = makeSut();
		const encryptSpy = vi.spyOn(encrypterStub, "encrypt");
		const accountData = {
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};
		await sut.add(accountData);
		expect(encryptSpy).toHaveBeenCalledWith("valid_password");
	});

	test("Should throws if Encrypter throws", async () => {
		const { sut, encrypterStub } = makeSut();
		vi.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const accountData = {
			name: "valid_name",
			email: "valid_email",
			password: "invalid_password",
		};
		const promise = sut.add(accountData);
		await expect(promise).rejects.toThrow();
	});
});
