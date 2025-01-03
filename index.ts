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
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      f: {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  /*
  console.log(values);
  console.log(positionals);
  */

  const path = values.f ? values.f : null;

  return path;
}

async function fileTextFromPath(path?: string) {
  const html = INDEX;

  if (!path) {
    return await html.text();
  }

  const fileMarkdown = Bun.file(path);
  const fileMarkdownText = await fileMarkdown.text();
  const fileMarkup = marked.parse(fileMarkdownText);

  const fileText =
    fileMarkup.toString().length === 0 ? await html.text() : fileMarkup;

  // console.log(`<fileTextFromPath()> [fileText]: ${fileText}`);
  return fileText;
}

function buildStyledMarkup(markup: string) {
  const styledMarkup = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Hey There Delilah</title>
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
    console.warn(`Error: values doesn't contain a flag`);
  }

  const fileTextToRender = await fileTextFromPath(path!);
  const styledMarkup = buildStyledMarkup(fileTextToRender);

  const webview = new Webview();
  webview.setHTML(styledMarkup);
  webview.run();
}

console.log(`check embedded files`);

Bun.embeddedFiles.forEach((f, i) => {
  console.log(`#${i} name: ${f.name}`);
});

const path = getPathFromArgs();
await runWebview(path);
