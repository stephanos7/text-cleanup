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
npm run lint
npm run build
npm run preview
```
