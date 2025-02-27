import mongoose, { Collection, Mongoose } from "mongoose";

export const MongooseHelper = {
	client: null as Mongoose,
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
		if (mongoose.connection.readyState !== 1) {
			await this.connect(this.uri);
		}
		return this.client.connection.collection(name);
	},
};
