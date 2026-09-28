import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Resource Name & Version aus package.json lesen
const pkgPath = path.resolve(rootDir, 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
const resourceName = process.env.PKG_NAME || pkg.name || 'fivem-resource';
const tagName = process.env.TAG_NAME || `v${pkg.version || '1.0.0'}`;

function getGitCommits() {
  let prevTag = '';
  try {
    // Suche das vorherige Git-Tag vor HEAD
    prevTag = execSync('git describe --tags --abbrev=0 HEAD^', { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    // Kein vorheriges Tag gefunden
  }

  const range = prevTag ? `${prevTag}..HEAD` : '';
  const logCmd = range
    ? `git log ${range} --pretty=format:"%h|%s"`
    : `git log -n 50 --pretty=format:"%h|%s"`;

  try {
    const rawLogs = execSync(logCmd, { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (!rawLogs) return [];
    return rawLogs.split('\n').map((line) => {
      const [hash, ...subjectParts] = line.split('|');
      return { hash: hash.trim(), subject: subjectParts.join('|').trim() };
    });
  } catch {
    return [];
  }
}

function generateChangelog() {
  const commits = getGitCommits();

  const categories = {
    feat: { title: '✨ Neue Features', items: [] },
    fix: { title: '🐛 Fehlerbehebungen', items: [] },
    perf: { title: '⚡ Performance-Optimierungen', items: [] },
    refactor: { title: '♻️ Refactoring', items: [] },
    docs: { title: '📝 Dokumentation', items: [] },
    style: { title: '🎨 Code-Style & Formatierung', items: [] },
    test: { title: '🧪 Tests', items: [] },
    chore: { title: '🔧 Wartung & Chores', items: [] },
    ci: { title: '⚙️ CI/CD Pipeline', items: [] },
    other: { title: '🔄 Sonstige Änderungen', items: [] },
  };

  // Conventional Commit Regex: type(scope)!: subject
  const commitRegex = /^(?<type>feat|fix|perf|refactor|docs|style|test|chore|ci)(?:\((?<scope>[^)]+)\))?!?: (?<subject>.+)$/i;

  for (const { hash, subject } of commits) {
    if (!subject) continue;

    const match = subject.match(commitRegex);
    if (match && match.groups) {
      const { type, scope, subject: commitSubject } = match.groups;
      const lowerType = type.toLowerCase();
      const scopePrefix = scope ? `**${scope}**: ` : '';
      const formatted = `- ${scopePrefix}${commitSubject} (\`${hash}\`)`;

      if (categories[lowerType]) {
        categories[lowerType].items.push(formatted);
      } else {
        categories.other.items.push(`- ${subject} (\`${hash}\`)`);
      }
    } else {
      categories.other.items.push(`- ${subject} (\`${hash}\`)`);
    }
  }

  let changelogBody = '';
  let hasCategorizedChanges = false;

  for (const key of Object.keys(categories)) {
    const cat = categories[key];
    if (cat.items.length > 0) {
      hasCategorizedChanges = true;
      changelogBody += `### ${cat.title}\n${cat.items.join('\n')}\n\n`;
    }
  }

  if (!hasCategorizedChanges) {
    changelogBody = '_Keine detaillierten Commit-Meldungen vorhanden._\n\n';
  }

  const fullReleaseNotes = `## 🚀 Release ${tagName}

${changelogBody.trim()}

---

### 📦 Installation
1. Lade die unten angehängte Datei \`${resourceName}.zip\` herunter.
2. Entpacke den Ordner \`${resourceName}\` in den \`resources\`-Ordner deines FiveM-Servers.
3. Füge \`ensure ${resourceName}\` zu deiner \`server.cfg\` hinzu.
`;

  return fullReleaseNotes;
}

const changelog = generateChangelog();

// Wenn als Argument ein Dateipfad übergeben wurde, schreibe in die Datei, sonst nach stdout
const outputFileArg = process.argv[2];
if (outputFileArg) {
  const outputPath = path.resolve(rootDir, outputFileArg);
  fs.writeFileSync(outputPath, changelog, 'utf8');
  console.log(`📝 Release Notes erfolgreich in "${outputFileArg}" geschrieben.`);
} else {
  console.log(changelog);
}
