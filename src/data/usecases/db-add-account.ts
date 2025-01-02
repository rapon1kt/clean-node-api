import { AddAccount, AddAccountModel } from "@/domain/usecases";
import { Encrypter } from "../protocols/encrypter";
import { Account } from "@/domain/models";

export class DbAddAccount implements AddAccount {
	private readonly encrypter: Encrypter;
	constructor(encrypter: Encrypter) {
		this.encrypter = encrypter;
	}
	async add(account: Account): Promise<AddAccountModel> {
		await this.encrypter.encrypt(account.password);
		return new Promise((resolve) => resolve(null));
	}
}
