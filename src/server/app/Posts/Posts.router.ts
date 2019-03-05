import { Router } from "express";
import { create, list, item, itemRate, itemComment } from "./Posts.controller";

export const PostRouter: Router = Router()
	/**
	 * Creates new post and returns it
	 */
	.post("/create", create)

	/**
	 * Gets the list of posts and returns it
	 */
	.post("/list", list)

	/**
	 * Gets one post and returns it
	 */
	.post("/item", item)

	.post("/item/rate", itemRate)

	.post("/item/comment", itemComment);
