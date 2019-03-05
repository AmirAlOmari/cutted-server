var fs = require("fs");
var path = require("path");
var compressor = require("node-minify");
const configs = require("./configs.json");
const { INFO } = configs.__installCycleVariables._prefixes;
var count = 0;
var rootDirectory = "../dest";

function counter() {
	let str = "";
	for (let i = 0; i < count; i++) {
		str += "    ";
	}
	return str;
}

async function rec(current, dest) {
	current = path.resolve(current, dest);
	count++;
	var entries = fs.readdirSync(path.resolve(current));
	var startTime = new Date().getTime();
	for (const entry of entries) {
		var stat = fs.statSync(path.resolve(current, entry));
		if (stat.isDirectory()) {
			console.log(`${INFO}__minifier(): ` + counter() + "./" + entry + "/");
			await rec(current, entry);
		} else {
			if (entry.toString().endsWith(".js") === true) {
				await compressor.minify({
					compressor: "uglifyjs",
					input: path.join(current, entry),
					output: path.join(current, entry),
				});
				console.log(`${INFO}__minifier(): ` + counter() + "./" + entry + " (" + (new Date().getTime() - startTime) / 1000 + "s)");
			}
		}
	}
	current = current.split(path.sep);
	current.pop();
	current = path.join(current.join(path.sep));
	count--;
	return String((new Date().getTime() - startTime) / 1000) + "s";
}

let startTime = new Date().getTime();
console.log(`${INFO}__minifier(): Folder structure:`);
console.log(`${INFO}__minifier(): .${rootDirectory.replace("..", "")}/`);
rec(path.resolve(__dirname), rootDirectory.endsWith("/") ? rootDirectory : rootDirectory + "/")
	.then(function(s) {
		console.log(`${INFO}__minifier(): Finished in ${s}\n`);
	})
	.catch(e => {
		console.log(`${ERROR}__minifier(): ${e}`);
		process.exit(0);
	});
