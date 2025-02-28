require("dotenv").config();
import { MongooseHelper } from "@/infra/db/mongodb/helpers/mongoose-helper";
import { LogMongoRepository } from "@/infra/db/mongodb/log-repository/log";
import { Collection } from "mongoose";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "vitest";

describe("Log Mongo Repository", () => {
	let errorCollection: Collection;

	beforeAll(async () => {
		await MongooseHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongooseHelper.disconnect();
	});

	beforeEach(async () => {
		errorCollection = await MongooseHelper.getCollection("errors");
		await errorCollection.deleteMany({});
	});

	test("Should create an error log on success", async () => {
		const sut = new LogMongoRepository();
		await sut.logError("any_error");
		const count = await errorCollection.countDocuments();
		expect(count).toBe(1);
	});
});
