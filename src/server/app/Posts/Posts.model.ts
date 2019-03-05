import { Document, Model, model, Schema, Types } from "mongoose";

// Rate
export interface IRate {
	userId?: Types.ObjectId;
	rate?: number;
	time?: number;
}
export const Rate: Schema<IRate> = new Schema(
	{
		userId: Types.ObjectId,
		rate: Number,
		time: Number,
	},
	{
		versionKey: false,
	}
);

// Comment
export interface IComment {
	userId?: Types.ObjectId;
	comment?: string;
	time?: number;
	rates?: Array<IRate>;
	comments?: Array<IComment>;
}
export const Comment: Schema<IComment> = new Schema(
	{
		userId: Types.ObjectId,
		comment: String,
		time: Number,
		rates: [Rate],
	},
	{
		versionKey: false,
	}
);
Comment.add({
	comments: [Comment],
});

// Post
export interface IPost {
	userId?: Types.ObjectId;
	title?: string;
	content?: string;
	avgRate?: number;
	views?: number;
	rates?: Array<IRate>;
	comments?: Array<IComment>;
}
export const PostSchema: Schema<IPost> = new Schema(
	{
		userId: Types.ObjectId,
		title: String,
		content: String,
		avgRate: Number,
		views: Number,
		rates: [Rate],
		comments: [
			{
				userId: Types.ObjectId,
				comment: String,
				time: Number,
				rates: [Rate],
			},
		],
	},
	{
		versionKey: false,
	}
);

export const Posts: Model<Document, {}> = model("Posts", PostSchema);
