import * as fs from "fs";
import { getLogFileStream, log, logFileName } from "./log-system";
import { unixTime } from "./unix-time";

export const folders: Array<string> = ["_workspace/logs"];

export const createFolder = (folder: string): void => {
	const subfolders = folder.split("/");
	let current: string = "";
	for (let i = 0; i < subfolders.length; i++) {
		const subfolder = subfolders[i];
		current += subfolder;
		if (!fs.existsSync(current)) {
			log(`${current} was not found. Building...`, "yellow", {
				toFile: false,
			});
			fs.mkdirSync(current);
		} else {
			log(`${current} was found`, "green", { toFile: false });
		}
		current += "/";
	}
};

export const createFolders = (paths: Array<string>): void => {
	paths.forEach((path: string) => {
		createFolder(path);
	});
};

export const onStartUp = () => {
	createFolders(folders);

	getLogFileStream().write(String(`*******************************************\n`));
	log(`APP: Starting...`, "yellow");

	const onClose = (signal?: any) => {
		return (code?: any) => {
			let color: "green" | "red" = "green";
			if (typeof code === "number" && code !== 0) {
				color = "red";
			}

			process.stdout.write("\n");
			log(`APP: Closed. signal: "${signal}", code: ${code}`, color);
			process.exit();
		};
	};

	const signals: Array<NodeJS.Signals | string> = ["SIGINT", "SIGQUIT", "SIGILL", "beforeExit"];
	signals.forEach(async (signal: any) => {
		process.on(signal, onClose(signal));
		log(`Added listener "${signal}".`, "green");
	});
};
