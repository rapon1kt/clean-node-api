export class ServerErorr extends Error {
	constructor() {
		super("Internal Server Error");
		this.name = "ServerError";
	}
}
