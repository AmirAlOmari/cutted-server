"use strict";

const path = require("path");
const fs = require("fs");
const configs = require("./configs.json");
const { _preinstallTimeFileName } = configs.__installCycleVariables;
const { INFO } = configs.__installCycleVariables._prefixes;

console.log(`${INFO}INSTALL CYCLE STARTED.`);

const preinstallTimeFilePath = path.resolve(__dirname, "./", _preinstallTimeFileName);

const startTime = new Date();
fs.writeFileSync(preinstallTimeFilePath, startTime);

console.log(`${INFO}PREINSTALL TIME WAS WRITTEN INTO "./__ecosystem-utils/${_preinstallTimeFileName}".`);

console.log("\n");
