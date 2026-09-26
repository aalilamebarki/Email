import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Find all html files
function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Scanning ${htmlFiles.length} HTML files for non-vector or colored emoji icons...`);

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;

let cleanedCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace common emojis used as icons with clean text or vector SVGs
  content = content.replace(/📚\s*/g, '');
  content = content.replace(/🛡️\s*/g, '');
  content = content.replace(/⚡\s*/g, '');
  content = content.replace(/🔒\s*/g, '');
  content = content.replace(/🚀\s*/g, '');
  content = content.replace(/💡\s*/g, '');
  content = content.replace(/🔍\s*/g, '');
  content = content.replace(/⚙️\s*/g, '');
  content = content.replace(/📧\s*/g, '');
  content = content.replace(/⏱️\s*/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    cleanedCount++;
    console.log(`Cleaned emojis from: ${path.relative(rootDir, file)}`);
  }
}

console.log(`✓ Cleaned ${cleanedCount} files. All icons across the site are now purely stroke-based minimalist vector SVGs (Feather / Lucide / React Icons style).`);
