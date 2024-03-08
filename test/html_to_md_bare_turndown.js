// minimist: handle the args of cli
const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");

// var TurndownService = require("turndown");
var TurndownService = require('../lib/turndown.cjs.js')
// var TurndownService = require('../src/turndown.js')
var turndownService = new TurndownService({ codeBlockStyle: "fenced" });

let input_file = args["input"];
let output_file = args["output"];

input_file = input_file || './test/test.html';
output_file = output_file || 'test.md';
const html_text = fs.readFileSync(input_file, "utf8");

// real turndown calling
var md_text = turndownService.turndown(html_text);

console.log(md_text)
fs.writeFile(output_file, md_text, "utf8", (err) => {});