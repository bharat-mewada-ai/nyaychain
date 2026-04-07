import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let original = fs.readFileSync(filePath, 'utf8');
    let replaced = original.replace(/-purple-/g, '-emerald-').replace(/purple-/g, 'emerald-');
    if (original !== replaced) {
      fs.writeFileSync(filePath, replaced);
      console.log('Updated', filePath);
    }
  }
});
