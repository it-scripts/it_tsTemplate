import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Dynamically Read Name & Version from package.json
const pkgPath = path.resolve(rootDir, 'package.json');
const pkg = fs.existsSync(pkgPath) ? fs.readJsonSync(pkgPath) : {};
const resourceName = pkg.name || 'fivem-resource';

const releaseDir = path.resolve(rootDir, 'release');
const targetResourceDir = path.resolve(releaseDir, resourceName);
const zipFilePath = path.resolve(releaseDir, `${resourceName}.zip`);

async function createZip(sourceDir, outPath, folderName) {
  const archive = new ZipArchive({ zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, folderName)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

async function runPackaging() {
  console.log('====================================================');
  console.log(`Start FiveM Resource Packaging: ${resourceName}`);
  console.log('====================================================');

  try {
    console.log('\n[1/4] Compile Vue 3 NUI front end & TypeScript scripts...');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });

    console.log('\n[2/4] Prepare the release directory...');
    await fs.remove(releaseDir);
    await fs.ensureDir(targetResourceDir);

    console.log('[3/4] Copy production files...');
    
    // fxmanifest.lua
    await fs.copy(path.resolve(rootDir, 'fxmanifest.lua'), path.resolve(targetResourceDir, 'fxmanifest.lua'));
    
    // config.json
    if (await fs.pathExists(path.resolve(rootDir, 'config.json'))) {
      await fs.copy(path.resolve(rootDir, 'config.json'), path.resolve(targetResourceDir, 'config.json'));
    }

    // dist Folder (client.js, server.js, web/)
    await fs.copy(path.resolve(rootDir, 'dist'), path.resolve(targetResourceDir, 'dist'));
    
    // locales Folder
    if (await fs.pathExists(path.resolve(rootDir, 'locales'))) {
      await fs.copy(path.resolve(rootDir, 'locales'), path.resolve(targetResourceDir, 'locales'));
    }

    // README.md
    if (await fs.pathExists(path.resolve(rootDir, 'README.md'))) {
      await fs.copy(path.resolve(rootDir, 'README.md'), path.resolve(targetResourceDir, 'README.md'));
    }

    console.log('[4/4] Create a ZIP archive for server deployment...');
    await createZip(targetResourceDir, zipFilePath, resourceName);

    console.log('\n====================================================');
    console.log(`Packaging successfully completed!`);
    console.log(`Final server folder: release/${resourceName}`);
    console.log(`Final ZIP archive:     release/${resourceName}.zip`);
    console.log(`You can drag the “release/${resourceName}” folder directly`);
    console.log(`into the “resources” folder on your FiveM server!`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('\nPackaging Error:', error);
    process.exit(1);
  }
}

runPackaging();
