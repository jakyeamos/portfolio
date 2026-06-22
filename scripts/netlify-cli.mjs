#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const tmpRoot = process.env.TMPDIR || '/tmp';
const netlifyHome = resolve(tmpRoot, 'portfolio-netlify-home');
const netlifyConfig = resolve(tmpRoot, 'portfolio-netlify-xdg');
const netlifyBin = resolve(repoRoot, 'node_modules/.bin/netlify');
const args = process.argv.slice(2);

if (args[0] === '--') args.shift();

mkdirSync(netlifyHome, { recursive: true });
mkdirSync(netlifyConfig, { recursive: true });

const child = spawn(netlifyBin, args, {
  cwd: repoRoot,
  env: {
    ...process.env,
    HOME: netlifyHome,
    XDG_CONFIG_HOME: netlifyConfig,
  },
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error(`Failed to run local Netlify CLI: ${error.message}`);
  process.exit(1);
});
