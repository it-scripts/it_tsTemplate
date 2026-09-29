import { build, context } from 'esbuild';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const isWatch = process.argv.includes('--watch');
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

// Sicherstellen, dass dist Ordner existiert
if (!existsSync(resolve(rootDir, 'dist'))) {
  mkdirSync(resolve(rootDir, 'dist'), { recursive: true });
}

// Client Build Konfiguration
const clientConfig = {
  entryPoints: [resolve(rootDir, 'src/client/client.ts')],
  bundle: true,
  outfile: resolve(rootDir, 'dist/client.js'),
  target: 'es2022',
  format: 'iife',
  platform: 'browser',
  minify: isProduction,
  sourcemap: !isProduction,
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
};

// Server Build Konfiguration
const serverConfig = {
  entryPoints: [resolve(rootDir, 'src/server/server.ts')],
  bundle: true,
  outfile: resolve(rootDir, 'dist/server.js'),
  target: 'node22',
  format: 'cjs',
  platform: 'node',
  minify: isProduction,
  sourcemap: !isProduction,
  loader: {
    '.json': 'json',
  },
  logLevel: 'info',
};

async function run() {
  console.log(`[Build] Starte TypeScript Build (${isProduction ? 'Production' : 'Development'})...`);

  try {
    if (isWatch) {
      console.log('[Build] Starte Watcher für Client & Server Scripts...');
      const clientCtx = await context(clientConfig);
      const serverCtx = await context(serverConfig);

      await clientCtx.watch();
      await serverCtx.watch();
      console.log('[Build] Watcher aktiv. Änderungen werden automatisch kompiliert.');
    } else {
      await Promise.all([
        build(clientConfig),
        build(serverConfig)
      ]);
      console.log('[Build] Client & Server Scripts erfolgreich kompiliert!');
    }
  } catch (error) {
    console.error('[Build] Fehler beim Kompilieren:', error);
    process.exit(1);
  }
}

run();
