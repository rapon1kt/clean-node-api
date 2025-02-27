import { AddAcccountRepository } from "@/data/protocols";
import { Account } from "@/domain/models";
import { AddAccountModel } from "@/domain/usecases";
import { MongooseHelper } from "../helpers/mongoose-helper";

export class AccountMongoRepository implements AddAcccountRepository {
	async add(accountData: AddAccountModel): Promise<Account> {
		const accountCollection = await MongooseHelper.getCollection("accounts");
		const result = await accountCollection.insertOne(accountData);
		const account: any = await accountCollection.findOne({
			_id: result.insertedId,
		});
		const { _id, ...accountWithoutId } = account;
		return Object.assign({}, accountWithoutId, { id: account._id });
	}
}
