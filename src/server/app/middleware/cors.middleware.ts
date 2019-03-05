import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Appending CORS-needed headers to let client browser
 * send AJAX request into way different from web-server
 * IP address.
 */
export const CORS: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	res.append("Access-Control-Allow-Headers", "Content-Type, Keep-Alive, Authorization");
	res.append("Access-Control-Allow-Headers", "Content-Type, Keep-Alive, Authorization");
	res.append("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
	res.append("Access-Control-Allow-Origin", "*");

	if (req.method === "OPTIONS") {
		const send = { code: 200, message: "OK" };
		return res.status(send.code).send(send);
	} else {
		return next();
	}
};
