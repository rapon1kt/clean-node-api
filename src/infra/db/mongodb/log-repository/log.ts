import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { MongooseHelper } from "../helpers/mongoose-helper";

export class LogMongoRepository implements LogErrorRepository {
	async logError(stack: string): Promise<void> {
		const errorCollection = await MongooseHelper.getCollection("errors");
		await errorCollection.insertOne({
			stack,
			date: new Date(),
		});
	}
}
