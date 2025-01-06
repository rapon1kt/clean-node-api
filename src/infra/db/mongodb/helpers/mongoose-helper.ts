import mongoose, { Collection } from "mongoose";

export const MongooseHelper = {
	client: mongoose,
	async connect(uri: string): Promise<void> {
		this.client = await this.client.connect(uri);
		await this.client.connection.db.admin().command({ ping: 1 });
	},

	async disconnect(): Promise<void> {
		await this.client.disconnect();
	},

	getCollection(name: string): Collection {
		return this.client.connection.collection(name);
	},
};
