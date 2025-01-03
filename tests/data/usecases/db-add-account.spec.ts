import { DbAddAccount } from "@/data/usecases/db-add-account";
import { describe, expect, test, vi } from "vitest";
import { Encrypter } from "../protocols/encrypter";
import { AddAcccountRepository } from "../protocols";
import { AddAccountModel } from "@/domain/usecases";
import { Account } from "@/domain/models";

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
	addAccountRepositoryStub: AddAcccountRepository;
}

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(value: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_password"));
		}
	}
	return new EncrypterStub();
};

const makeAddAcountRepository = (): AddAcccountRepository => {
	class AddAccountRepositoryStub implements AddAcccountRepository {
		add(accountData: AddAccountModel): Promise<Account> {
			const fakeAccount = {
				name: "valid_name",
				email: "valid_email",
				password: "hashed_password",
			};
			return new Promise((resolve) => resolve(fakeAccount));
		}
	}
	return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter();
	const addAccountRepositoryStub = makeAddAcountRepository();
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub,
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

	test("Should calls AddAccountRepository with correct values", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addAccountRepositorySpy = vi.spyOn(addAccountRepositoryStub, "add");
		const accountData = {
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};
		await sut.add(accountData);
		expect(addAccountRepositorySpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_email",
			password: "hashed_password",
		});
	});
});
