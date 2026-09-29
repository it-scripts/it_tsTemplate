import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read Resource Name & Version from package.json
const pkgPath = path.resolve(rootDir, 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
const resourceName = process.env.PKG_NAME || pkg.name || 'fivem-resource';
const tagName = process.env.TAG_NAME || `v${pkg.version || '1.0.0'}`;

function getGitCommits() {
  let prevTag = '';
  try {
    prevTag = execSync('git describe --tags --abbrev=0 HEAD^', { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    // No previous tag found
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
    feat: { title: 'Features', items: [] },
    fix: { title: 'Bug Fixes', items: [] },
    perf: { title: 'Performance Improvements', items: [] },
    refactor: { title: 'Code Refactoring', items: [] },
    docs: { title: 'Documentation', items: [] },
    style: { title: 'Styles & Formatting', items: [] },
    test: { title: 'Tests', items: [] },
    chore: { title: 'Maintenance & Chores', items: [] },
    ci: { title: 'Continuous Integration', items: [] },
    other: { title: 'Other Changes', items: [] },
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
    changelogBody = '_No detailed commit messages recorded._\n\n';
  }

  const fullReleaseNotes = `## Release ${tagName}

${changelogBody.trim()}

---

### Deployment Instructions
1. Download the attached asset \`${resourceName}.zip\`.
2. Extract the \`${resourceName}\` directory into your server's \`resources\` folder.
3. Add \`ensure ${resourceName}\` to your \`server.cfg\`.
`;

  return fullReleaseNotes;
}

const changelog = generateChangelog();


const outputFileArg = process.argv[2];
if (outputFileArg) {
  const outputPath = path.resolve(rootDir, outputFileArg);
  fs.writeFileSync(outputPath, changelog, 'utf8');
  console.log(`Release notes written to "${outputFileArg}".`);
} else {
  console.log(changelog);
}
