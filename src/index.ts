import mongoose, { Mongoose } from "mongoose";
import { start } from "./server";
import { log } from "./utilities";
import { onStartUp } from "./utilities/on-start-up-function";

let DB: Mongoose;

onStartUp();

log("Connecting to DB...", "yellow");
mongoose
	.connect("mongodb://localhost:27017/admin", {
		useNewUrlParser: true,
	})
	.then((db: Mongoose) => {
		DB = db;
		log("Connected to DB!", "green");

		start()
			.then((port: number) => {
				log(`Servers initiated on port ${port}`, "green");
			})
			.catch(error => {
				log(`Servers initiating throwed error: ${error}`, "red");
			});
	})
	.catch(error => {
		log(`Couldnot connect to DB. Reason: ${JSON.stringify(error, null, 2)}`, "red");
	});
