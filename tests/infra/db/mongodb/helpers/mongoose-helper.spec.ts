require("dotenv").config();
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { MongooseHelper as sut } from "@/infra/db/mongodb/helpers/mongoose-helper";

describe("MongooseHelper", () => {
	beforeAll(async () => {
		await sut.connect(process.env.MONGO_URl);
	});

	afterAll(async () => {
		await sut.disconnect();
	});

	test("Should reconnect if mongodb is down", async () => {
		let accountCollection = await sut.getCollection("accounts");
		expect(accountCollection).toBeTruthy();
		await sut.disconnect();
		accountCollection = await sut.getCollection("accounts");
		expect(accountCollection).toBeTruthy();
	});
});
