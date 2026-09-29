import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Submitted bump type: patch, minor, major, or specific version (e.g., 1.2.3)
const bumpType = process.argv[2] ? process.argv[2].toLowerCase() : 'patch';

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
  
  // If a specific version was provided (e.g., “2.0.0”)
  if (/^\d+\.\d+\.\d+(?:-.+)?$/.test(type)) {
    return type;
  }

  if (!semver) {
    console.error(`Unable to parse the current version “${currentVersion}” as SemVer.`);
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
      console.error(`Invalid bump type “${type}”. Allowed: patch, minor, major, or, for example, 1.2.3`);
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
  console.log(`${path.relative(rootDir, filePath)}: ${oldVersion} -> ${newVersion}`);
}

function updateFxmanifestVersion(filePath, newVersion) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Exact matching only for the “version ‘...’” line (not fx_version)
  const versionRegex = /^\s*version\s+['"]([^'"]+)['"]/m;
  const match = content.match(versionRegex);
  
  if (match) {
    const oldVersion = match[1];
    content = content.replace(versionRegex, `version '${newVersion}'`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${path.relative(rootDir, filePath)}: ${oldVersion} -> ${newVersion}`);
  } else {
    console.warn(`No "version" line found in ${path.relative(rootDir, filePath)}.`);
  }
}

function runVersionBump() {
  if (!fs.existsSync(rootPkgPath)) {
    console.error('The root package.json file was not found!');
    process.exit(1);
  }

  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  const currentVersion = rootPkg.version || '1.0.0';
  const newVersion = calculateNextVersion(currentVersion, bumpType);

  console.log('====================================================');
  console.log(`Version Bump (${bumpType.toUpperCase()})`);
  console.log(`   Old: v${currentVersion}`);
  console.log(`   New: v${newVersion}`);
  console.log('====================================================\n');

  console.log('Update Version in Project Files:');
  
  // Root package.json
  updateJsonVersion(rootPkgPath, newVersion);

  // web/package.json
  updateJsonVersion(webPkgPath, newVersion);

  // fxmanifest.lua
  updateFxmanifestVersion(fxmanifestPath, newVersion);

  console.log('\n====================================================');
  console.log(`Version successfully updated to v${newVersion}!`);
  console.log(`Now perform a commit/release.`);
  console.log('====================================================\n');
}

runVersionBump();
