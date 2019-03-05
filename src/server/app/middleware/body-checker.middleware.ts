import { NextFunction, Request, Response } from "express";
import { log } from "../../../utilities";
import { BodyRule } from "../utilities/http/body-rules";
import { HTTPReponseErorr, HTTPResponse } from "../utilities/http/http-response.interface";
import { C400 } from "../utilities/http/http-response.template";

const _getSubErrors = (rules: Array<BodyRule>): Array<HTTPReponseErorr> => {
	let errors: Array<HTTPReponseErorr> = [];
	for (const rule of rules) {
		if (!rule.optional) {
			const error = rule.error;
			errors.push({
				...error,
				message: `'${error.message}' not found`,
			});
			if (rule.sub) {
				errors = errors.concat(_getSubErrors(rule.sub));
			}
		}
	}
	return errors;
};

const _bodyCheck = (body: any, rules: Array<BodyRule>, globalBody: any): { errors: Array<HTTPReponseErorr>; body: any } => {
	let errors: Array<HTTPReponseErorr> = [];
	for (const rule of rules) {
		const error = rule.error;
		if (body[rule.key] != null) {
			switch (rule.type) {
				case "string":
				case "boolean":
				case "number":
					if (typeof body[rule.key] !== rule.type) {
						errors.push({
							...error,
							message: `'${error.message}' does not match type: '${rule.type}'`,
						});
						continue;
					}
					break;

				case "object":
					if (typeof body[rule.key] !== rule.type) {
						errors.push({
							...error,
							message: `'${error.message}' does not match type: '${rule.type}'`,
						});
						errors = errors.concat(_getSubErrors(rule.sub as Array<BodyRule>));
						continue;
					}
					const rec = _bodyCheck(body[rule.key], rule.sub as Array<BodyRule>, body);
					body[rule.key] = rec.body;
					if (rec.errors.length) {
						errors = errors.concat(rec.errors);
						continue;
					}
					break;

				case "array":
					if (!Array.isArray(body[rule.key])) {
						errors.push({
							...error,
							message: `'${error.message}' does not match type: '${rule.type}'`,
						});
						continue;
					}
					break;

				default:
					log(`_bodyCheck(): Unkown type: ${rule.type} at `, "red");
					break;
			}
			if (rule.type !== "array" && rule.values && Array.isArray(rule.values) && !rule.values.includes(body[rule.key])) {
				errors.push({
					...error,
					message: `'${error.message}' does not match values: ${rule.values}`,
				});
			} else if (rule.type === "array" && rule.values && Array.isArray(rule.values) && !rule.values.includes(body[rule.key])) {
				/** @todo */
			}

			if (rule.validators) {
				for (const validator of rule.validators) {
					const result = validator(body[rule.key], rule, globalBody);
					if (typeof result === "boolean" && result === false) {
						errors.push({
							...error,
							message: `'${error.message}' invalid`,
						});
					} else if (typeof result === "string") {
						errors.push({
							...error,
							message: `'${error.message}' invalid, ${result}`,
						});
					}
				}
			}
		} else if (rule.optional) {
			if (rule.default !== void null) {
				body[rule.key] = rule.default;
			}
		} else {
			errors.push({
				...error,
				message: `'${error.message}' not found`,
			});
			if (rule.sub) {
				errors = errors.concat(_getSubErrors(rule.sub as Array<BodyRule>));
			}
		}
	}
	return { errors, body };
};

export const BodyChecker = (rules: Array<BodyRule>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		let send: HTTPResponse;

		if (!req.body) {
			send = {
				...C400,
				errors: _getSubErrors(rules),
			};
			return res.status(send.code).send(send);
		}

		const { errors, body } = _bodyCheck(req.body, rules, req.body);
		if (errors.length) {
			send = {
				...C400,
				errors,
			};
			return res.status(send.code).send(send);
		}
		req.body = body;
		next();
	};
};
