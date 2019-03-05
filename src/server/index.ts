import express from "express";
import http from "http";
import WebSocket from "websocket";
import { log } from "./../utilities";
import { app } from "./app";

const PORT = 3000;
const HOST = `localhost:${PORT}`;

export const start = (): Promise<number> => {
	return new Promise((resolve, reject) => {
		try {
			const server = app.listen(PORT, () => {
				const WS = new WebSocket.server({ httpServer: server });
				WS.on("request", request => {
					if (request.host !== HOST) {
						return request.reject(403, `request host does not match: '${HOST}'`);
					}

					const connection = request.accept();

					connection.on("message", data => {
						if (data.type !== "utf8") {
							return connection.close();
						}

						connection.sendUTF(`received ${data.utf8Data}`);
					});
				});
				resolve(PORT);
			});
		} catch (e) {
			reject(e);
		}
	});
};
