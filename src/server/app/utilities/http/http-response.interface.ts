export enum HTTPResponseCode {
	OK = 200,
	BAD_REQUEST = 400,
	ACCESS_DENIED = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}

export enum HTTPResponseMessage {
	OK = "OK",
	ERRORS = "ERRORS",
	INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export interface HTTPReponseErorr {
	code: number;
	message: string;
}

export interface HTTPResponse {
	code: HTTPResponseCode;
	message: HTTPResponseMessage;
	data?: any;
	errors?: Array<HTTPReponseErorr>;
	erorr?: any;
	[key: string]: any;
}
