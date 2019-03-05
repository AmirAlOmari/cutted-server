import { RequestHandler, Router } from "express";
import { Document } from "mongoose";
import { ListFeature } from "../features/list-feature/list-feature";
import { BodyChecker } from "../middleware/body-checker.middleware";
import { BodyRule, BodyRules } from "../utilities/http/body-rules";
import { HTTPResponse } from "../utilities/http/http-response.interface";
import { C200, C500, C404 } from "../utilities/http/http-response.template";
import { User, ILoginResponse } from "./Users.class";
import { IUser } from "./Users.model";
import ErrorCodes from "../utilities/http/error-codes";

export const register: Array<RequestHandler> = [
	BodyChecker(<Array<BodyRule>>BodyRules.users.register),
	async (req, res) => {
		let send: HTTPResponse;

		User.register(req.body)
			.then((user: Document & IUser) => {
				send = {
					...C200,
					data: user,
				};
				return res.status(send.code).send(send);
			})
			.catch(error => {
				send = {
					...C500,
					error,
				};
				return res.status(send.code).send(send);
			});
	},
];

export const login: Array<RequestHandler> = [
	BodyChecker(BodyRules.users.login),
	async (req, res) => {
		let send: HTTPResponse;

		const email: string = req.body.email;
		const password: string = req.body.password;

		User.login(email, password)
			.then(answer => {
				if (answer.error) {
					send = {
						...C404,
						errors: [ErrorCodes[0]],
					};
				} else {
					send = {
						...C200,
						data: answer.data,
					};
					res.set("Authorization", `Bearer ${answer.data!.token}`);
				}
				return res.status(send.code).send(send);
			})
			.catch(error => {
				send = {
					...C500,
					error,
				};
				return res.status(send.code).send(send);
			});
	},
];

export const list: Array<RequestHandler> = [
	BodyChecker(BodyRules.users.list),
	async (req, res) => {
		let send: HTTPResponse;

		const listConditions: ListFeature = req.body;

		User.list(listConditions)
			.then(answer => {
				const { array, sort, paginate, filters } = answer;
				send = {
					...C200,
					data: array,
					sort,
					paginate,
					filters,
				};
				return res.status(send.code).send(send);
			})
			.catch(error => {
				send = {
					...C500,
					error,
				};
				return res.status(send.code).send(send);
			});
	},
];

export const item: Array<RequestHandler> = [
	BodyChecker(BodyRules.users.item),
	async (req, res) => {
		let send: HTTPResponse;

		const userId: string = req.body.userId;

		User.item(userId)
			.then(user => {
				if (user) {
					send = {
						...C200,
						data: user,
					};
				} else {
					send = {
						...C404,
					};
				}
				return res.status(send.code).send(send);
			})
			.catch(error => {
				send = {
					...C500,
					error,
				};
				return res.status(send.code).send(send);
			});
	},
];
