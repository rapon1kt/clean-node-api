import { Controller } from "@/presentation/protocols";
import { DbAddAccount } from "../../data/usecases";
import { BcryptAdapter } from "../../infra/cryptography";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { SignUpController } from "../../presentation/controllers";
import { EmailValidatorAdapter } from "../../utils";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const emailValidatorAdapter = new EmailValidatorAdapter();
	const bcryptAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
	const signUpController = new SignUpController(
		emailValidatorAdapter,
		dbAddAccount
	);
	return new LogControllerDecorator(signUpController);
};
