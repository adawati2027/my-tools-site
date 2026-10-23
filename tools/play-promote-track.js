// Assign an already-uploaded versionCode to another Play Console track (no re-upload).
// Usage: node tools/play-promote-track.js <packageName> <versionCode> <track>
// Requires: npm install googleapis --no-save
// Key file: C:\Users\96896\Downloads\adawati-challenges-2c5b9e85d41e.json (local only)
const { google } = require('googleapis');

const KEY_FILE = 'C:\\Users\\96896\\Downloads\\adawati-challenges-2c5b9e85d41e.json';
const packageName = process.argv[2];
const versionCode = process.argv[3];
const track = process.argv[4];
const status = process.argv[5] || 'completed';

if (!packageName || !versionCode || !track) {
  console.error('Usage: node tools/play-promote-track.js <packageName> <versionCode> <track> [status]');
  process.exit(1);
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  const androidpublisher = google.androidpublisher({ version: 'v3', auth });

  const edit = await androidpublisher.edits.insert({ packageName });
  const editId = edit.data.id;
  console.log('Edit created:', editId);

  await androidpublisher.edits.tracks.update({
    packageName,
    editId,
    track,
    requestBody: {
      track,
      releases: [{ versionCodes: [String(versionCode)], status }],
    },
  });

  await androidpublisher.edits.commit({ packageName, editId });
  console.log(`Committed. versionCode ${versionCode} assigned to track "${track}".`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
