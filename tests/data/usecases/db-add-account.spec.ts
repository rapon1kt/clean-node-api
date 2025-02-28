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
			return new Promise((resolve) => resolve(makeFakeAccount()));
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

const makeFakeAccount = (): Account => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email",
	password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
	name: "valid_name",
	email: "valid_email",
	password: "valid_password",
});

describe("DbAddAccount", () => {
	test("Should call Encrypter with correct password", async () => {
		const { sut, encrypterStub } = makeSut();
		const encryptSpy = vi.spyOn(encrypterStub, "encrypt");
		await sut.add(makeFakeAccountData());
		expect(encryptSpy).toHaveBeenCalledWith("valid_password");
	});

	test("Should throws if Encrypter throws", async () => {
		const { sut, encrypterStub } = makeSut();
		vi.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.add(makeFakeAccountData());
		await expect(promise).rejects.toThrow();
	});

	test("Should calls AddAccountRepository with correct values", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addAccountRepositorySpy = vi.spyOn(addAccountRepositoryStub, "add");
		await sut.add(makeFakeAccountData());
		expect(addAccountRepositorySpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_email",
			password: "hashed_password",
		});
	});

	test("Should throw an error if AddAccountRepository throws", async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		vi.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.add(makeFakeAccountData());
		await expect(promise).rejects.toThrow();
	});

	test("Should return an account on success", async () => {
		const { sut } = makeSut();
		const account = await sut.add(makeFakeAccountData());
		expect(account).toEqual(makeFakeAccount());
	});
});
