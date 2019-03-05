"use strict";

const path = require("path");
const fs = require("fs");
const configs = require("./configs.json");
const { _preinstallTimeFileName } = configs.__installCycleVariables;
const { INFO } = configs.__installCycleVariables._prefixes;

const preinstallTimeFilePath = path.resolve(__dirname, "./", _preinstallTimeFileName);
const startTime = Number(new Date(fs.readFileSync(preinstallTimeFilePath).toString()).getTime());

console.log(`${INFO}PREINSTALL TIME FILE WAS READ FROM "./${_preinstallTimeFileName}".`);

fs.unlinkSync(preinstallTimeFilePath);

console.log(`${INFO}PREINSTALL TIME FILE WAS DELETED.`);

const endTime = new Date().getTime();
const takenTime = (endTime / 1000 - startTime / 1000).toFixed(3);

console.log(`${INFO}INSTALL CYCLE FINISED IN ${takenTime}s.`);

console.log("\n");
