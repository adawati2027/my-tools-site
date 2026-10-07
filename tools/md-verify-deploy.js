// Runs after the nightly CLAUDE.md cleanup (tools/md-cleanup.cmd).
// Sanity-checks CLAUDE.md; if it passes and changed since the last deploy, pushes CLAUDE.md + the archive.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const STATE = path.join(process.env.LOCALAPPDATA || ROOT, 'adawati-md-deploy-state.json');
const md = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
const archive = path.join(ROOT, 'docs/history/claude-md-archive.md');
const stamp = new Date().toISOString();
const problems = [];
const size = Buffer.byteLength(md);
if (size < 1000 || size > 8000) problems.push('size ' + size + ' bytes is outside 1000–8000');
for (const h of ['## Token-saving rules', '## Deployment', '## Verification policy', '## Open items', '## Documentation index', 'push-files.js', 'GITHUB_PAT'])
  if (!md.includes(h)) problems.push('missing "' + h + '"');
if (!fs.existsSync(archive)) problems.push('archive file missing');
if (/```[^`]*$/.test(md)) problems.push('unclosed code fence');
if (problems.length) { console.log(stamp + ' VERIFY FAILED - not deployed: ' + problems.join('; ')); process.exit(1); }
const hash = crypto.createHash('sha256').update(md).update(fs.readFileSync(archive)).digest('hex');
let state = {}; try { state = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) {}
if (state.hash === hash) { console.log(stamp + ' verify OK (' + size + ' bytes), unchanged since last deploy - nothing to push'); process.exit(0); }
try {
  const out = execFileSync(process.execPath, [path.join(ROOT, 'push-files.js'), 'CLAUDE.md', 'docs/history/claude-md-archive.md', '--message', 'Daily CLAUDE.md cleanup (auto)'], { cwd: ROOT, encoding: 'utf8', timeout: 180000 });
  if (!/SUCCESS/.test(out)) throw new Error(out.split('\n').slice(-3).join(' '));
  fs.writeFileSync(STATE, JSON.stringify({ hash, at: stamp, size }));
  console.log(stamp + ' verify OK (' + size + ' bytes) - deployed');
} catch (e) { console.log(stamp + ' DEPLOY FAILED: ' + e.message); process.exit(1); }
