import { Types } from "mongoose";
import ErrorCodes from "./error-codes";
import { HTTPReponseErorr } from "./http-response.interface";

export interface BodyRule {
	key: string;
	type: "string" | "number" | "boolean" | "array" | "object";
	error: HTTPReponseErorr;
	optional?: true;
	default?: any;
	values?:
		| Array<any>
		| {
				min?: number;
				max?: number;
		  };
	validators?: Array<IValidator>;
	sub?: Array<BodyRule>;
}

export interface IValidator {
	(value: any, rule: BodyRule, globalBody: any): boolean | string;
}

const ListFeatureRules: Array<BodyRule> = [
	{
		key: "sort",
		type: "object",
		error: ErrorCodes[6],
		optional: true,
		sub: [
			{
				key: "by",
				type: "string",
				error: ErrorCodes[7],
			},
			{
				key: "order",
				type: "string",
				values: ["asc", "desc"],
				error: ErrorCodes[8],
			},
		],
	},
	{
		key: "paginate",
		type: "object",
		error: ErrorCodes[9],
		optional: true,
		sub: [
			{
				key: "countOnPage",
				type: "number",
				error: ErrorCodes[10],
			},
			{
				key: "page",
				type: "number",
				error: ErrorCodes[11],
			},
		],
	},
];

export interface IBodyRules {
	users: {
		register: Array<BodyRule>;
		login: Array<BodyRule>;
		list: Array<BodyRule>;
		item: Array<BodyRule>;
	};
	posts: {
		create: Array<BodyRule>;
		list: Array<BodyRule>;
		item: Array<BodyRule>;
		itemRate: Array<BodyRule>;
		itemComment: Array<BodyRule>;
	};
	[key: string]: {
		[key: string]: Array<BodyRule>;
	};
}
export const BodyRules: IBodyRules = {
	users: {
		register: [
			{
				key: "fname",
				type: "string",
				error: ErrorCodes[1],
			},
			{
				key: "lname",
				type: "string",
				error: ErrorCodes[2],
			},
			{
				key: "email",
				type: "string",
				error: ErrorCodes[3],
				validators: [
					(value: string, rule: BodyRule) => {
						if (false) {
							return false;
						}
						return true;
					},
				],
			},
			{
				key: "password",
				type: "string",
				error: ErrorCodes[4],
				validators: [
					(value: string, rule: BodyRule) => {
						if (value.length < 8) {
							return "too short";
						}
						return true;
					},
				],
			},
		],
		login: [
			{
				key: "email",
				type: "string",
				error: ErrorCodes[3],
				validators: [
					(value: string, rule: BodyRule) => {
						if (false) {
							return false;
						}
						return true;
					},
				],
			},
			{
				key: "password",
				type: "string",
				error: ErrorCodes[4],
				validators: [
					(value: string, rule: BodyRule) => {
						if (value.length < 8) {
							return "too short";
						}
						return true;
					},
				],
			},
		],
		list: [...ListFeatureRules],
		item: [
			{
				key: "userId",
				type: "string",
				error: ErrorCodes[0],
				validators: [
					(value: string) => {
						if (!Types.ObjectId.isValid(value)) {
							return "not valid ObjectId";
						}
						return true;
					},
				],
			},
		],
	},
	posts: {
		create: [
			{
				key: "title",
				type: "string",
				error: ErrorCodes[0],
			},
			{
				key: "content",
				type: "string",
				error: ErrorCodes[0],
			},
		],
		list: [...ListFeatureRules],
		item: [
			{
				key: "postId",
				type: "string",
				error: ErrorCodes[0],
			},
		],
		itemRate: [
			{
				key: "postId",
				type: "string",
				error: ErrorCodes[0],
			},
			{
				key: "rate",
				type: "number",
				error: ErrorCodes[0],
			},
		],
		itemComment: [
			{
				key: "postId",
				type: "string",
				error: ErrorCodes[0],
			},
			{
				key: "comment",
				type: "string",
				error: ErrorCodes[0],
			},
		],
	},
};
