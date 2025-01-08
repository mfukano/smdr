import index from "./index.html" with { type: "file" };
import globalStyles from "./css/style.css" with { type: "file" };
import ghDark from "./css/github-dark.css" with { type: "file" };
import ghLight from "./css/github-light.css" with { type: "file" };

import { Webview } from "webview-bun";
import { parseArgs } from "util";
import { marked } from "marked";

const INDEX = Bun.file(index);
const GLOBAL_STYLES = await Bun.file(globalStyles).text();
const GH_DARK = await Bun.file(ghDark).text();
const GH_LIGHT = await Bun.file(ghLight).text();

const THEME = GH_DARK; // GH_LIGHT also valid

function getPathFromArgs() {
  const path = Bun.argv[2] || null;
  if (!path) {
    console.warn("No path provided");
  }

  return path;
}

async function fileTextFromPath(path: string | null) {
  const html = INDEX;

  if (!path) {
    return { fileName: "index.html", fileText: await html.text() };
  }

  const fileMarkdown = Bun.file(path);

  if (!fileMarkdown.exists()) {
    throw new Error("File does not exist or wasn't found");
  }

  const fileName = fileMarkdown.name!.split("/").pop(); // all files have names...right?
  const fileMarkup = marked.parse(await fileMarkdown.text());

  if (fileMarkup.toString().length === 0) {
    throw new Error(
      "File appears to have zero length, or was unparseable; is something wrong with your file?",
    );
  }

  // we need to await fileMarkup because we need to guarantee marked.parse has text to process
  return { fileName: fileName, fileText: await fileMarkup };
}

function buildStyledMarkup(markup: string) {
  const styledMarkup = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        ${GLOBAL_STYLES}
        ${THEME}
      </style>
    </head>
    <body>
      <main>
        <article class="markdown-body">
          ${markup}
        </article>
      </main>
    </body>
  </html>
`;

  /*
    console.log(`<buildStyledMarkup()> {styledMarkup}: 
${styledMarkup}`);
  */

  return styledMarkup;
}

async function runWebview(path: string | null) {
  if (!path) {
    // set different HTML here
    console.warn(`WARNING: values doesn't contain a flag`);
  }

  const { fileName, fileText } = await fileTextFromPath(path);
  const styledMarkup = buildStyledMarkup(fileText);

  const webview = new Webview();
  webview.title = fileName!;
  webview.setHTML(styledMarkup);
  webview.run();
}

console.log(`check embedded files`);

/*
// embedded file logging 
Bun.embeddedFiles.forEach((f, i) => {
  console.log(`#${i} name: ${f.name}`);
});
*/

const path = getPathFromArgs();
await runWebview(path);
