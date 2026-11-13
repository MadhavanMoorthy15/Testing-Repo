#!/usr/bin/env node
// Writes a new React app folder that matches the conventions of this repository.
//
// Usage:
//   node .boldcreate/skills/build-react-app/scripts/scaffold-app.mjs <app-name> [--dir <parent>]
//
// The script refuses to write into a folder that already exists. It never installs
// dependencies; run `npm install` inside the new folder afterwards.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..", "..", "..", "..");

/** Read the arguments. */
function parseArgs(argv) {
  const args = { name: "", parent: repoRoot };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dir") {
      const next = argv[i + 1];
      if (!next) throw new Error("--dir needs a folder path");
      args.parent = resolve(next);
      i++;
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown option ${arg}`);
    } else if (!args.name) {
      args.name = arg;
    } else {
      throw new Error(`unexpected argument ${arg}`);
    }
  }
  return args;
}

/** A folder name that works as a package name, a folder name and a database name. */
function validateName(name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(
      `the app name must start with a letter and hold only lowercase letters, digits and hyphens: ${name}`,
    );
  }
  if (name.endsWith("-")) {
    throw new Error(`the app name must not end with a hyphen: ${name}`);
  }
  return name;
}

/** The title of the app, from its folder name. */
function titleOf(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.name) {
    console.error("usage: node scaffold-app.mjs <app-name> [--dir <parent>]");
    process.exit(1);
  }

  const appName = validateName(args.name);
  const appDir = join(args.parent, appName);

  if (existsSync(appDir)) {
    console.error(`the folder already exists: ${appDir}`);
    process.exit(1);
  }

  const files = buildFiles(appName);
  for (const [relPath, content] of Object.entries(files)) {
    const target = join(appDir, relPath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
  }

  console.log(`created ${appDir}`);
  console.log(`next: cd ${appName} && npm install && npm run build && npm test`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

/** The files to write, as a path relative to the app folder and its content. */
function buildFiles(appName) {
  const appTitle = titleOf(appName);
  const pkgName = `${appName}-app`;
  const files = {
    "package.json": `${JSON.stringify(
      {
        name: pkgName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
          test: "vitest run",
        },
        dependencies: {
          react: "^19.2.4",
          "react-dom": "^19.2.4",
          "react-router-dom": "^7.13.2",
        },
        devDependencies: {
          "@testing-library/jest-dom": "^6.6.3",
          "@testing-library/react": "^16.3.0",
          "@testing-library/user-event": "^14.6.1",
          "@types/react": "^19.2.14",
          "@types/react-dom": "^19.2.3",
          "@vitejs/plugin-react": "^6.0.1",
          jsdom: "^26.1.0",
          typescript: "^6.0.2",
          vite: "^8.0.3",
          vitest: "^3.2.4",
        },
      },
      null,
      2,
    )}\n`,

    "tsconfig.json": `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          useDefineForClassFields: true,
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          types: ["vitest/globals", "@testing-library/jest-dom"],
        },
        include: ["src"],
      },
      null,
      2,
    )}\n`,

    "vite.config.ts": `import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test-setup.ts',
    },
  });
  `,

    "index.html": `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appTitle}</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  `,

    "src/main.tsx": `import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import App from './App';
  import './index.css';

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
  `,

    "src/App.tsx": `import { Routes, Route, Navigate } from 'react-router-dom';
  import HomePage from './pages/HomePage';

  export default function App() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
  `,

    "src/pages/HomePage.tsx": `export default function HomePage() {
    return (
      <main className="page">
        <h1>${appTitle}</h1>
        <p>Replace this page with the first feature.</p>
      </main>
    );
  }
  `,

    "src/test-setup.ts": `import '@testing-library/jest-dom/vitest';
  `,

    "src/vite-env.d.ts": `/// <reference types="vite/client" />
  `,

    "src/App.test.tsx": `import { render, screen } from '@testing-library/react';
  import { MemoryRouter } from 'react-router-dom';
  import { describe, expect, it } from 'vitest';
  import App from './App';

  describe('App', () => {
    it('renders the home page', () => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: '${appTitle}' })).toBeInTheDocument();
    });
  });
  `,

    "src/index.css": `:root {
    --font-family: 'Inter', system-ui, -apple-system, sans-serif;
    --font-size-base: 16px;
    --font-size-sm: 14px;
    --font-size-lg: 18px;

    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-text-primary: #0f172a;
    --color-text-secondary: #64748b;
    --color-border: #e2e8f0;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;

    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);
  }

  [data-theme='dark'] {
    --color-primary: #60a5fa;
    --color-primary-hover: #93c5fd;
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: #94a3b8;
    --color-border: #334155;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: var(--font-size-base);
  }

  body {
    font-family: var(--font-family);
    color: var(--color-text-primary);
    background-color: var(--color-background);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 24px;
  }
  `,
  };
  return files;
}
