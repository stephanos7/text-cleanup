# Text cleaner

A minimal, responsive text editor built with React and plain CSS. Remove extra spaces or blank lines, and undo or redo changes. Text stays in browser memory and is cleared on refresh.

## Implementations and search visibility

This project explores React's `useReducer` and `useState` through two implementations of the same text cleaner. The public app at `/` uses `useReducer`; `/state` is a `useState` implementation demo with a purple palette. The former `/reducer` route has been removed.

Netlify builds and publishes `dist` using `netlify.toml`. Only `/state` and `/state/` are rewritten to the app shell, with an `X-Robots-Tag: noindex` header. React also adds a `noindex` meta tag on the demo and not-found views and removes it on navigation to `/`. The homepage HTML remains indexable.

The build generates `404.html` with a `noindex` meta tag. Netlify serves it with HTTP 404 for unknown paths, including `/reducer`. There is no catch-all HTTP 200 rewrite. Vite's local development and preview servers do not reproduce Netlify's response headers or HTTP 404 routing.

The footer uses product-focused copy and `data-nosnippet`, which excludes its text from Google search snippets, not from indexing. The demo remains publicly accessible; `noindex` is an instruction to compliant search engines, not access control. Previously indexed URLs require recrawling before removal.

## Development

```sh
npm install
npm run dev
```

## Checks and build

```sh
npm test
npm run format:check
npm run lint
npm run build
npm run preview
```

## History and text limits

Both implementations read `HISTORY_LIMIT` and `MAX_TEXT_LENGTH` from `src/textCleanerConfig.js`. The defaults are 15 history transitions and 100 UTF-16 units of text. The text limit starts small for testing; change the constants and reload the editor to test other values.

Undo and redo share the history budget: five undos from a full history leave ten undo steps and five redo steps. A new edit clears redo, retains the newest undo entries, and discards older entries beyond the limit. Each input change remains its own undo step.

Oversized pastes are rejected in full, accounting for selected text being replaced. Oversized cleaning results are also rejected. Neither rejection changes text or history. The displayed character count uses JavaScript string length, so some emoji count as multiple characters.

## Formatting

Run `npm run format` to format the project, or `npm run format:check` to check formatting without changing files. Prettier uses two spaces, single quotes in JavaScript, and no optional semicolons. Generated output and the dependency lockfile are excluded.

In VS Code, install the recommended **Prettier - Code formatter** extension (`esbenp.prettier-vscode`). This repository's `.vscode/settings.json` enables format-on-save for JavaScript, JSX, JSON, CSS, HTML, and Markdown. These settings apply only when this project is open and do not change your global editor preferences.
