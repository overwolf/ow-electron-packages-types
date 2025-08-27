const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Header block to prepend
const header = `import { overwolf } from '@overwolf/ow-electron';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Size,
  WebContents,
  Display,
  Rectangle
} from 'electron';

import { EventEmitter } from 'events';

// -----------------------------------------------------------------------------
`;

// Get CLI arguments
const args = process.argv.slice(2);
const inputDir = args[0];       // e.g. ./modules

if (!inputDir) {
  console.error(`❌ Usage: node combine-dts.js <input-directory> <output-file>`);
  console.error(`Example: node combine-dts.js ./modules .`);
  process.exit(1);
}

function combineDTSFiles() {
  const absInput = path.resolve(inputDir);

  if (!fs.existsSync(absInput)) {
    console.error(`❌ Input directory does not exist: ${absInput}`);
    process.exit(1);
  }

  // Build glob pattern and replace backslashes with forward slashes for Windows compatibility
  let pattern = path.join(absInput, '**', '*.d.ts');
  pattern = pattern.replace(/\\/g, '/');

  console.log('Using glob pattern:', pattern);

  // Find all .d.ts files recursively
  const files = glob.sync(pattern);

  console.log('Files found:', files);

  if (files.length === 0) {
    console.warn(`⚠️ No .d.ts files found in: ${inputDir}`);
    return;
  }

  let combined = header;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(process.cwd(), file);
    combined += `\n// --- ${relativePath} ---\n` + content + "\n";
  }

  // write combined content to "types.d.ts" in project root
  const outputPath = path.join(process.cwd(), "types.d.ts");
  fs.writeFileSync(outputPath, combined, "utf-8");

  console.log(`✅ Combined types written to ${outputPath}`);
}

combineDTSFiles();
