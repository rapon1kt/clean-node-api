import mongoose, { Collection } from "mongoose";

export const MongooseHelper = {
	client: mongoose,
	uri: null as string,
	async connect(uri: string): Promise<void> {
		this.uri = uri;
		this.client = await mongoose.connect(uri);
		await this.client.connection.db.admin().command({ ping: 1 });
	},

	async disconnect(): Promise<void> {
		await this.client.disconnect();
		this.client = null;
	},

	async getCollection(name: string): Promise<Collection> {
		if (this.client.connection.readyState === 0) {
			await this.connect(this.uri);
		}
		return this.client.connection.collection(name);
	},
};
