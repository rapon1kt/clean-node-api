import { AddAccount, AddAccountModel } from "@/domain/usecases";
import { Encrypter } from "../protocols/encrypter";
import { Account } from "@/domain/models";
import { AddAcccountRepository } from "../protocols";

export class DbAddAccount implements AddAccount {
	private readonly encrypter: Encrypter;
	private readonly addAccountRepository: AddAcccountRepository;
	constructor(
		encrypter: Encrypter,
		addAccountRepository: AddAcccountRepository
	) {
		this.encrypter = encrypter;
		this.addAccountRepository = addAccountRepository;
	}
	async add(accountData: AddAccountModel): Promise<AddAccountModel> {
		const hashedPassword = await this.encrypter.encrypt(accountData.password);
		const account = await this.addAccountRepository.add(
			Object.assign({}, accountData, { password: hashedPassword })
		);
		return account;
	}
}
