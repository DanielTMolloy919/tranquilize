import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distFirefox = path.join(__dirname, 'dist-firefox');
const manifestPath = path.join(distFirefox, 'manifest.json');

console.log('🔧 Fixing Firefox build...');

// Read the manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Find the background script in dist (Chrome build)
const distChrome = path.join(__dirname, 'dist');
const chromeAssets = fs.readdirSync(path.join(distChrome, 'assets'));
const backgroundScript = chromeAssets.find(file => 
  file.match(/^index\.ts-[a-z0-9]+\.js$/) && 
  !file.includes('content-script-loader')
);

if (!backgroundScript) {
  console.error('❌ Could not find background script in Chrome build');
  process.exit(1);
}

console.log(`📄 Found background script: ${backgroundScript}`);

// Copy the background script to Firefox assets
const sourceFile = path.join(distChrome, 'assets', backgroundScript);
const destFile = path.join(distFirefox, 'assets', backgroundScript);
fs.copyFileSync(sourceFile, destFile);
console.log(`✅ Copied background script to Firefox build`);

// Update the manifest
manifest.background = {
  scripts: [`assets/${backgroundScript}`],
  type: "module"
};

// Write the fixed manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Fixed Firefox manifest.json');
console.log(`   Background script: assets/${backgroundScript}`);

