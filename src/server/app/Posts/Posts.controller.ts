import { NextFunction, Request, Response, Router, RequestHandler } from "express";
import { Document } from "mongoose";
import { ListFeature } from "../features/list-feature/list-feature";
import { BodyChecker } from "../middleware/body-checker.middleware";
import { BodyRule, BodyRules } from "../utilities/http/body-rules";
import { HTTPResponse } from "../utilities/http/http-response.interface";
import { C200, C404, C500 } from "../utilities/http/http-response.template";
import { Post } from "./Posts.class";
import { IPost, Posts } from "./Posts.model";
import { AuthorizedRequest } from "./../utilities/http/authorized-request.interface";
import { IUser } from "../Users/Users.model";
import { AuthorizedOnly } from "../middleware/authorized-only.middleware";

export type RHPipe = Array<RequestHandler>;

export const create: RHPipe = [
	AuthorizedOnly,
	BodyChecker(BodyRules.posts.create),
	async (req: AuthorizedRequest, res) => {
		let send: HTTPResponse;

		const userId: string = (<Document & IUser>req.user)._id;

		Post.create(req.body, userId)
			.then((post: Document & IPost) => {
				send = {
					...C200,
					data: post,
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

export const list: RHPipe = [
	BodyChecker(BodyRules.posts.list),
	async (req, res) => {
		let send: HTTPResponse;

		const listConditions: ListFeature = req.body;

		Post.list(listConditions)
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

export const item: RHPipe = [
	BodyChecker(BodyRules.posts.item),
	async (req, res) => {
		let send: HTTPResponse;

		const postId: string = req.body.postId;

		Post.item(postId)
			.then(post => {
				if (post) {
					send = {
						...C200,
						data: post,
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

export const itemRate: RHPipe = [
	AuthorizedOnly,
	BodyChecker(BodyRules.posts.itemRate),
	async (req: AuthorizedRequest, res) => {
		let send: HTTPResponse;

		const postId: string = req.body.postId;
		const userId: string = (<Document & IUser>req.user)._id;
		const rate: number = req.body.rate;

		Post.ratePost(postId, userId, rate)
			.then(_ => {
				send = {
					...C200,
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

export const itemComment: RHPipe = [
	AuthorizedOnly,
	BodyChecker(BodyRules.posts.itemComment),
	async (req: AuthorizedRequest, res) => {
		let send: HTTPResponse;

		const postId: string = req.body.postId;
		const userId: string = (<Document & IUser>req.user)._id;
		const comment: string = req.body.comment;

		Post.commentPost(postId, userId, comment)
			.then(_ => {
				send = {
					...C200,
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
