const args = require("minimist")(process.argv.slice(2));

var TurndownService = require("turndown");
var turndownService = new TurndownService({ codeBlockStyle: "fenced" });

var fs = require("fs");

const input_file = args["input"];
const output_file = args["output"];

const html_text = fs.readFileSync(input_file, "utf8");

var turndownPluginGfm = require("turndown-plugin-gfm");
var gfm = turndownPluginGfm.gfm;
var tables = turndownPluginGfm.tables;
var strikethrough = turndownPluginGfm.strikethrough;

turndownService.use(gfm);
turndownService.use([tables, strikethrough]);

turndownService.rules.blankRule = {
  replacement: function (content, node) {
    return node.isBlock && !isDescendantOfTag(node, "TABLE") ? "\n\n" : "";
  },
};

turndownService.addRule("tableParagraph", {
  filter: function (node, options) {
    return (
      (node.nodeName === "BR" ||
        node.nodeName === "P" ||
        node.nodeName === "SECTION") &&
      isDescendantOfTag(node, "TABLE")
    );
  },
  replacement: function (content, node, options) {
    return content + " ";
  },
});

function isDescendantOfTag(node, tag) {
  if (node.parentNode) {
    if (node.parentNode.nodeName === tag) {
      return true;
    } else {
      return isDescendantOfTag(node.parentNode, tag);
    }
  }
  return false;
}

var markdown = turndownService.turndown(html_text);

fs.writeFile(output_file, markdown, "utf8", (err) => {});