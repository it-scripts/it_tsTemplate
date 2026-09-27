import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starte Entwicklungs-Umgebung (Web Dev Server + TS Scripts Watcher)...');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Starte Vite Dev Server
const webProcess = spawn(npmCmd, ['--prefix', 'web', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

// Starte TS Scripts Watcher
const scriptsProcess = spawn(npmCmd, ['run', 'watch:scripts'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  webProcess.kill();
  scriptsProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
