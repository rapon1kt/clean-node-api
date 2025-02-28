export class ServerErorr extends Error {
	constructor(stack: string) {
		super("Internal Server Error");
		this.name = "ServerError";
		this.stack = stack;
	}
}
