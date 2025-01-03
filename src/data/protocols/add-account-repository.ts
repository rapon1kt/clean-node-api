import { Account } from "@/domain/models";
import { AddAccountModel } from "@/domain/usecases";

export interface AddAcccountRepository {
	add(accountData: AddAccountModel): Promise<Account>;
}
