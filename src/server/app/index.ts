import express, { Express, json } from "express";
import { CORS } from "./middleware/cors.middleware";
import { UserRouter } from "./Users/Users.router";
import { PostRouter } from "./Posts/Posts.router";

const app = express();

/* BODY PARSERS APPENDING */
app.use(json());

/* MIDDLEWARE APPENDING */
app.use(CORS);

/* ROUTERS APPENDING */
app.use("/api/users", UserRouter);
app.use("/api/posts", PostRouter);

export { app };
