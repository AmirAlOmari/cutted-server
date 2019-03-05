import { Router } from "express";
import { register, list, item, login } from "./Users.controller";

export const UserRouter: Router = Router()
	/**
	 * Registers new user and returns it
	 */
	.post("/register", register)

	.post("/login", login)

	/**
	 * Gets the list of users and returns it
	 */
	.post("/list", list)

	/**
	 * Gets one user and returns it
	 */
	.post("/item", item);
