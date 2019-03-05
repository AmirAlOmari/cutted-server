import { NextFunction, RequestHandler, Response } from "express";
import { AuthorizedRequest } from "./../utilities/http/authorized-request.interface";
import { C403, C500 } from "./../utilities/http/http-response.template";
import { decode, JWTPayload } from "./../utilities/jwt";
import { HTTPResponse } from "../utilities/http/http-response.interface";
import { User } from "./../Users/Users.class";

export const AuthorizedOnly: RequestHandler = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
	let send: HTTPResponse;

	if (!req.headers.authorization) {
		send = {
			...C403,
		};
		return res.status(send.code).send(send);
	}

	const token = req.headers.authorization.replace("Bearer ", "");

	let decoded: JWTPayload;
	try {
		decoded = decode(token);
	} catch (e) {
		send = {
			...C500,
			erorr: `catched decoding error ${e}`,
		};
		return res.status(send.code).send(send);
	}

	if (send!) {
		return;
	}

	User.item(decoded.userId)
		.then(user => {
			if (!user) {
				send = {
					...C403,
				};
				return res.status(send.code).send(send);
			}

			req.user = user;
			next();
		})
		.catch(error => {
			send = {
				...C500,
				error,
			};
			return res.status(send.code).send(send);
		});
};
