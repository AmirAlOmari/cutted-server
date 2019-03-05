import { Document, Model, model, Schema, Types } from "mongoose";

// Users
export interface IUser {
	fname?: string;
	lname?: string;
	email?: string;
	password?: string;
}
export const UserSchema: Schema<IUser> = new Schema(
	{
		fname: String,
		lname: String,
		email: String,
		password: String,
		posts: [Schema.Types.ObjectId],
		role: String,
	},
	{
		versionKey: false,
	}
);

export const Users: Model<Document, {}> = model("Users", UserSchema);
