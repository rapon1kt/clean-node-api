import { AddAcccountRepository } from "@/data/protocols";
import { Account } from "@/domain/models";
import { AddAccountModel } from "@/domain/usecases";
import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema<Account>({
	name: String,
	email: String,
	password: String,
});

export class AccountMongoRepository implements AddAcccountRepository {
	async add(accountData: AddAccountModel): Promise<Account> {
		const AccountCollection = mongoose.model("Accounts", AccountSchema);
		const result = new AccountCollection(accountData);
		const account = await result.save();
		const { _id, ...accountWithoutId } = account;
		return Object.assign({}, accountWithoutId, { id: _id });
	}
}
