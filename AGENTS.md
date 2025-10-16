# Repository Guidelines

## Project Structure & Module Organization
`client/` hosts the Vite + React SPA; key code lives in `client/src/` (pages, widgets, hooks) and static assets in `client/public/`. `server/` runs Express with MSSQL helpers in `server/database/`, controllers in `server/api/`, and shared business logic in `server/services/`. Deployment artifacts sit in `public_html/`, automation scripts in `deploy-*.sh`, and root `config/` holds environment-specific settings. Copy `server/env.example` (and any `env.*`) into `.env` before starting services.

## Build, Test, and Development Commands
Install dependencies per workspace with `npm install --prefix client` and `npm install --prefix server`. Start the SPA via `npm run dev --prefix client`; build production output using `npm run build --prefix client` (results land in `client/dist/` for downstream deploy scripts). Boot the API through `npm start --prefix server`, ensuring `.env` includes database and mail credentials. Until backend tests exist, hit `/api/health` plus a sample authenticated route after each change set.

## Coding Style & Naming Conventions
Use ES modules and two-space indentation throughout. React components, routes, and context providers stay in PascalCase; hooks and utilities use camelCase. Run `npm run lint --prefix client` before committing—ESLint enforces JS and React Hooks best practices while tolerating SHOUT_CASE constants. Mirror server files to the feature directories they support, keep middleware focused, and prefer async/await over raw promise chains.

## Testing Guidelines
Automated coverage is light today; new client features should ship with Vitest + React Testing Library specs under `client/src/__tests__/`. Mock network requests with Axios interceptors and export fixtures to simplify reuse. For API work, stage integration suites inside `server/tests/` (Jest or Vitest) against a disposable MSSQL database, seeding via scripts in `server/database/`. Document manual QA steps in your PR until ~80% coverage exists on touched modules.

## Commit & Pull Request Guidelines
Recent history favors concise, imperative commits (for example, `Enhance CardWizard UI`). Keep refactors isolated from feature or hotfix commits. Pull requests must include a short narrative, screenshots or cURL output for UI/API surfaces, linked issue IDs, and deployment or rollback notes. Rebase before pushing, ensure lint passes, and verify both `npm run dev --prefix client` and `npm start --prefix server` succeed locally.

## Deployment & Configuration Tips
Treat `deploy-client.sh` and `deploy-server.sh` as living documentation—update them when build steps change. Secrets stay outside version control; use `.env` files and hosting provider stores only. When adding third-party services, extend `vercel.json`, `vercel-backend.json`, or root `config/` with sample entries so operators can update environments quickly.
