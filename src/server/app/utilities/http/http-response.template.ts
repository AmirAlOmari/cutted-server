import { HTTPResponse, HTTPResponseCode, HTTPResponseMessage } from "./http-response.interface";

export const C200: HTTPResponse = {
	code: HTTPResponseCode.OK,
	message: HTTPResponseMessage.OK,
};

export const C400: HTTPResponse = {
	code: HTTPResponseCode.BAD_REQUEST,
	message: HTTPResponseMessage.ERRORS,
};

export const C403: HTTPResponse = {
	code: HTTPResponseCode.ACCESS_DENIED,
	message: HTTPResponseMessage.ERRORS,
};

export const C404: HTTPResponse = {
	code: HTTPResponseCode.NOT_FOUND,
	message: HTTPResponseMessage.ERRORS,
};

export const C409: HTTPResponse = {
	code: HTTPResponseCode.CONFLICT,
	message: HTTPResponseMessage.ERRORS,
};

export const C500: HTTPResponse = {
	code: HTTPResponseCode.INTERNAL_SERVER_ERROR,
	message: HTTPResponseMessage.INTERNAL_SERVER_ERROR,
};
