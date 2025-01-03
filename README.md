# Simple Markdown Document Reader

## What is this?

SMDR is a small utility to quickly check the general formatting of a markdown file.

It's inspired by [grip](https://github.com/joeyespo/grip),
which does a lot more than this and is rad, but also leverages the browser.
I tend to have oceans of tabs open in my browser when I'm coding or writing,
so having a document preview share browser space with something else I'm potentially
looking at or using is kind of annoying.

Instead, SMDR constructs a webview and injects it with local Github Markdown stylesheets
(c.o. [sindresorhus/github-markdown-css](https://github.com/sindresorhus/github-markdown-css)).

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun view [markdown file path]
```

To build:

```bash
bun build:dev
```

I also recommend aliasing it, since it can be annoying to type options - especially
for a binary that has _exactly one_ right now, but my dream is to potentially
make this bidirectional and a seamless click-in editor. (far-flung, maybe)

I'm using `zsh` with a dedicated `.zsh_aliases` file, so my setup
looks kinda like this:

```bash
alias smdr="/Users/mat/programs/smdr -f"
```

but if you're compiling it yourself you can put the bin anywhere and
change the path easily. All of the relevant stylesheets in the project
should be aliased and embedded into the executable.

## Configuration

Currently dark and light mode default sheets are included but no options
yet to change them in GUI.
Check line 15 of `index.tsx` if building for yourself.

## Shoutout Bun for being awesome

This project was created using `bun init` in bun v1.1.30.
[Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
