'use strict';
const fs   = require('fs');
const path = require('path');
const https = require('https');

if (!process.env.GITHUB_PAT) {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*GITHUB_PAT\s*=\s*(.+?)\s*$/);
      if (m) process.env.GITHUB_PAT = m[1];
    }
  }
}

const PAT   = process.env.GITHUB_PAT;
if (!PAT) { console.error('Missing GITHUB_PAT'); process.exit(1); }
const OWNER = 'adawati2027';
const REPO  = 'my-tools-site';
const BRANCH = 'main';
const SITE_DIR = __dirname;

function api(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}${endpoint}`,
      method,
      headers: {
        'Authorization': `token ${PAT}`,
        'User-Agent': 'adawati-deploy',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      }
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { resolve(raw); } });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, label, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      const waitMs = 1000 * Math.pow(2, i);
      console.error(`\n${label} failed (attempt ${i+1}/${attempts}): ${e.message || e}. Retrying in ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }
  throw lastErr;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  let commitMessage = 'Update site content (targeted push)';
  const relFiles = [];
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--message' || rawArgs[i] === '-m') {
      commitMessage = rawArgs[i + 1];
      i++;
    } else {
      relFiles.push(rawArgs[i]);
    }
  }
  if (!relFiles.length) { console.error('Usage: node push-files.js <file1> <file2> ... [--message "commit message"]'); process.exit(1); }

  console.log('Getting latest commit...');
  const refData = await withRetry(() => api('GET', `/git/ref/heads/${BRANCH}`), 'Get ref');
  const latestSha = refData.object && refData.object.sha;
  console.log('Latest commit:', latestSha);

  const commitData = await withRetry(() => api('GET', `/git/commits/${latestSha}`), 'Get commit');
  const baseTreeSha = commitData.tree && commitData.tree.sha;
  console.log('Base tree:', baseTreeSha);

  const treeItems = [];
  for (const rel of relFiles) {
    const full = path.join(SITE_DIR, rel);
    const content = fs.readFileSync(full);
    const body = { content: content.toString('base64'), encoding: 'base64' };
    const blob = await withRetry(() => api('POST', '/git/blobs', body), `Blob for ${rel}`);
    if (!blob.sha) { console.error('Blob failed for', rel, JSON.stringify(blob)); process.exit(1); }
    treeItems.push({ path: rel, mode: '100644', type: 'blob', sha: blob.sha });
    console.log('Blobbed:', rel, blob.sha);
    await sleep(400);
  }

  console.log('Creating tree...');
  const newTree = await withRetry(() => api('POST', '/git/trees', { base_tree: baseTreeSha, tree: treeItems }), 'Create tree');
  if (!newTree.sha) { console.error('Tree creation failed:', JSON.stringify(newTree).slice(0,500)); process.exit(1); }
  console.log('New tree:', newTree.sha);

  console.log('Creating commit...');
  const newCommit = await withRetry(() => api('POST', '/git/commits', {
    message: commitMessage,
    tree: newTree.sha,
    parents: [latestSha]
  }), 'Create commit');
  if (!newCommit.sha) { console.error('Commit failed:', JSON.stringify(newCommit).slice(0,500)); process.exit(1); }
  console.log('New commit:', newCommit.sha);

  console.log('Updating branch ref...');
  const updated = await withRetry(() => api('PATCH', `/git/refs/heads/${BRANCH}`, { sha: newCommit.sha, force: false }), 'Update ref');
  if (updated.object && updated.object.sha === newCommit.sha) {
    console.log('SUCCESS — branch updated to', newCommit.sha);
  } else {
    console.error('Ref update response:', JSON.stringify(updated).slice(0,500));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
