import * as fs from "fs";
import * as path from "path";
import { unixTime } from "./unix-time";

export const logFileName: string = `${new Date().toLocaleDateString()}.log`; // new Date().toISOString() throws exception on windows due to ':' symbol

let _logFileStream: fs.WriteStream;
export const getLogFileStream = () => {
	if (!_logFileStream) {
		const filePath = path.resolve(`${__dirname}/../../_workspace/logs/${logFileName}`);
		fs.writeFileSync(filePath, "", { flag: "w" });
		_logFileStream = fs.createWriteStream(filePath);
	}
	return _logFileStream;
};

interface CustomLoggingOptions {
	toFile?: boolean;
	toConsole?: boolean;
}

type CustomLoggingColors = "r" | "red" | "y" | "yellow" | "g" | "green";

export const logToFile = (message: string, color?: CustomLoggingColors): void => {
	return log(message, color, { toFile: true, toConsole: false });
};

export const logToConsole = (message: string, color?: CustomLoggingColors): void => {
	return log(message, color, { toFile: false, toConsole: true });
};

export const log = (message: string, color?: CustomLoggingColors, options?: CustomLoggingOptions): void => {
	if (!options) {
		options = {};
	}

	const time: number | string = new Date().getTime();
	let rawColor: string = "";
	let indicator = "";

	switch (color) {
		case "r":
		case "red":
			rawColor = "\x1b[31m";
			indicator = " ERROR:";
			break;

		case "y":
		case "yellow":
			rawColor = "\x1b[33m";
			break;

		case "g":
		case "green":
			rawColor = "\x1b[32m";
			break;

		default:
			rawColor = "\x1b[0m";
			break;
	}

	if (options.toConsole !== false) {
		message.split("\n").forEach((raw, index) => {
			indicator = index === 0 ? indicator : "";
			console.log(`${unixTime(time)}${rawColor}${indicator} ${raw}\x1b[0m`);
		});
	}

	if (options.toFile !== false) {
		message.split("\n").forEach((raw, index) => {
			getLogFileStream().write(`${unixTime(time)}${indicator} ${raw}\n`);
		});
	}
};
