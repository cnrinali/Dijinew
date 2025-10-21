# Dijinew Docs Site

This folder hosts the static site used to publish the Dijinew API documentation on a dedicated domain. It wraps the Markdown content located in the repository root `docs/` directory with a VitePress-powered UI.

## Prerequisites

- Node.js 18+

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

The site is served on [http://localhost:5173](http://localhost:5173) by default.

## Production Build

```bash
npm run build
```

Static assets are emitted to `.vitepress/dist`. Deploy that directory to the hosting solution backing your docs domain.

## Preview Build Output

```bash
npm run preview
```

This spins up a local server that serves the production build.
