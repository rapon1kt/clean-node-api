dotenv.config();
import dotenv from "dotenv";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account-repository";
import { MongooseHelper } from "@/infra/db/mongodb/helpers/mongoose-helper";

const makeSut = (): AccountMongoRepository => {
	return new AccountMongoRepository();
};

describe("Account Mongo Repository", () => {
	beforeAll(async () => {
		await MongooseHelper.connect(process.env.MONGO_URL);
	});
	beforeEach(async () => {
		const accountCollection = MongooseHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});
	test("Should return an account on success", async () => {
		const sut = makeSut();
		const account = await sut.add({
			name: "any_name",
			email: "any@email.com",
			password: "any_password",
		});
		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account._doc.name).toBe("any_name");
		expect(account._doc.email).toBe("any@email.com");
		expect(account._doc.password).toBe("any_password");
	});
	test("Should return correctlly an collection", () => {
		const sut = makeSut();
	});
});
