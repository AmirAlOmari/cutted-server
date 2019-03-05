import { sign, verify } from "jsonwebtoken";

const secret = "cutted";

export interface JWTPayload {
	userId: string;
}

export const encode = (data: JWTPayload): string => {
	return sign(data, secret);
};

export const decode = (encoded: string): any => {
	return verify(encoded, secret);
};
