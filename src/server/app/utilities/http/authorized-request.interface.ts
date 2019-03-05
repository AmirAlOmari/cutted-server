import { Request } from "express";
import { Document } from "mongoose";
import { IUser } from "./../../Users/Users.model";

export interface AuthorizedRequest extends Request {
	user?: Document & IUser;
}
