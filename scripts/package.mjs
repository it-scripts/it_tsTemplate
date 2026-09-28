import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Dynamisch Name & Version aus package.json lesen
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
  console.log(`📦  Starte FiveM Resource Packaging: ${resourceName}`);
  console.log('====================================================');

  try {
    // 1. Build ausführen (Web & Scripts)
    console.log('\n[1/4] 🔨 Kompiliere Vue 3 NUI Frontend & TypeScript Scripts...');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });

    // 2. Release-Ordner vorbereiten
    console.log('\n[2/4] 📂 Bereite Release-Verzeichnis vor...');
    await fs.remove(releaseDir);
    await fs.ensureDir(targetResourceDir);

    // 3. Relevante Dateien in den Release-Ordner kopieren
    console.log('[3/4] 📋 Kopiere Produktionsdateien...');
    
    // fxmanifest.lua
    await fs.copy(path.resolve(rootDir, 'fxmanifest.lua'), path.resolve(targetResourceDir, 'fxmanifest.lua'));
    
    // config.json
    if (await fs.pathExists(path.resolve(rootDir, 'config.json'))) {
      await fs.copy(path.resolve(rootDir, 'config.json'), path.resolve(targetResourceDir, 'config.json'));
    }

    // dist Ordner (client.js, server.js, web/)
    await fs.copy(path.resolve(rootDir, 'dist'), path.resolve(targetResourceDir, 'dist'));
    
    // locales Ordner
    if (await fs.pathExists(path.resolve(rootDir, 'locales'))) {
      await fs.copy(path.resolve(rootDir, 'locales'), path.resolve(targetResourceDir, 'locales'));
    }

    // README.md (falls vorhanden)
    if (await fs.pathExists(path.resolve(rootDir, 'README.md'))) {
      await fs.copy(path.resolve(rootDir, 'README.md'), path.resolve(targetResourceDir, 'README.md'));
    }

    // 4. ZIP Archiv für den Download / CI Release erstellen
    console.log('[4/4] 🗜️  Erstelle ZIP-Archiv für den Server-Deploy...');
    await createZip(targetResourceDir, zipFilePath, resourceName);

    console.log('\n====================================================');
    console.log('✅ Packaging erfolgreich abgeschlossen!');
    console.log(`📁 Fertiger Server-Ordner: release/${resourceName}`);
    console.log(`📦 Fertiges ZIP-Archiv:     release/${resourceName}.zip`);
    console.log(`👉 Du kannst den Ordner "release/${resourceName}" direkt`);
    console.log('   in den "resources"-Ordner deines FiveM-Servers ziehen!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('\n❌ Fehler beim Packaging:', error);
    process.exit(1);
  }
}

runPackaging();
