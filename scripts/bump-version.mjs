import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Übergebener Bump-Typ: patch, minor, major oder konkrete Version (z.B. 1.2.3)
const bumpType = process.argv[2] ? process.argv[2].toLowerCase() : 'patch';

// Dateipfade
const rootPkgPath = path.resolve(rootDir, 'package.json');
const webPkgPath = path.resolve(rootDir, 'web/package.json');
const fxmanifestPath = path.resolve(rootDir, 'fxmanifest.lua');

function parseSemver(versionStr) {
  const match = versionStr.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null,
  };
}

function calculateNextVersion(currentVersion, type) {
  const semver = parseSemver(currentVersion);
  
  // Wenn direkte Version übergeben wurde (z. B. "2.0.0")
  if (/^\d+\.\d+\.\d+(?:-.+)?$/.test(type)) {
    return type;
  }

  if (!semver) {
    console.error(`❌ Konnte aktuelle Version "${currentVersion}" nicht als SemVer parsen.`);
    process.exit(1);
  }

  let { major, minor, patch } = semver;

  switch (type) {
    case 'patch':
    case 'bugfix':
    case 'fix':
      patch += 1;
      break;
    case 'minor':
    case 'feature':
    case 'feat':
      minor += 1;
      patch = 0;
      break;
    case 'major':
    case 'breaking':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    default:
      console.error(`❌ Ungültiger Bump-Typ "${type}". Erlaubt: patch, minor, major oder z.B. 1.2.3`);
      process.exit(1);
  }

  return `${major}.${minor}.${patch}`;
}

function updateJsonVersion(filePath, newVersion) {
  if (!fs.existsSync(filePath)) return;
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const oldVersion = content.version;
  content.version = newVersion;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`  ✅ ${path.relative(rootDir, filePath)}: ${oldVersion} -> ${newVersion}`);
}

function updateFxmanifestVersion(filePath, newVersion) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Exaktes Matching nur für die "version '...'" Zeile (nicht fx_version)
  const versionRegex = /^\s*version\s+['"]([^'"]+)['"]/m;
  const match = content.match(versionRegex);
  
  if (match) {
    const oldVersion = match[1];
    content = content.replace(versionRegex, `version '${newVersion}'`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${path.relative(rootDir, filePath)}: ${oldVersion} -> ${newVersion}`);
  } else {
    console.warn(`  ⚠️ Keine "version"-Zeile in ${path.relative(rootDir, filePath)} gefunden.`);
  }
}

function runVersionBump() {
  if (!fs.existsSync(rootPkgPath)) {
    console.error('❌ Root package.json wurde nicht gefunden!');
    process.exit(1);
  }

  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  const currentVersion = rootPkg.version || '1.0.0';
  const newVersion = calculateNextVersion(currentVersion, bumpType);

  console.log('====================================================');
  console.log(`🚀 Version Bump (${bumpType.toUpperCase()})`);
  console.log(`   Alt: v${currentVersion}`);
  console.log(`   Neu: v${newVersion}`);
  console.log('====================================================\n');

  console.log('📝 Aktualisiere Version in Projektdateien:');
  
  // 1. Root package.json
  updateJsonVersion(rootPkgPath, newVersion);

  // 2. web/package.json
  updateJsonVersion(webPkgPath, newVersion);

  // 3. fxmanifest.lua
  updateFxmanifestVersion(fxmanifestPath, newVersion);

  console.log('\n====================================================');
  console.log(`🎉 Version erfolgreich auf v${newVersion} aktualisiert!`);
  console.log('👉 Führe nun einen Commit/Release aus.');
  console.log('====================================================\n');
}

runVersionBump();
