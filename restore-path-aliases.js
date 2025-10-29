const fs = require('fs');
const path = require('path');

function restorePathAliases(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Reemplazar imports relativos por path aliases
  const replacements = [
    // Shared imports
    { from: /from '\.\.\/\.\.\/\.\.\/shared\/([^']+)'/g, to: "from '@/shared/$1'" },
    { from: /from '\.\.\/\.\.\/shared\/([^']+)'/g, to: "from '@/shared/$1'" },
    { from: /from '\.\.\/shared\/([^']+)'/g, to: "from '@/shared/$1'" },
    
    // Domain imports
    { from: /from '\.\.\/\.\.\/\.\.\/domain\/([^']+)'/g, to: "from '@/domain/$1'" },
    { from: /from '\.\.\/\.\.\/domain\/([^']+)'/g, to: "from '@/domain/$1'" },
    { from: /from '\.\.\/domain\/([^']+)'/g, to: "from '@/domain/$1'" },
    
    // Application imports
    { from: /from '\.\.\/\.\.\/\.\.\/application\/([^']+)'/g, to: "from '@/application/$1'" },
    { from: /from '\.\.\/\.\.\/application\/([^']+)'/g, to: "from '@/application/$1'" },
    { from: /from '\.\.\/application\/([^']+)'/g, to: "from '@/application/$1'" },
    
    // Infrastructure imports
    { from: /from '\.\.\/\.\.\/\.\.\/infrastructure\/([^']+)'/g, to: "from '@/infrastructure/$1'" },
    { from: /from '\.\.\/\.\.\/infrastructure\/([^']+)'/g, to: "from '@/infrastructure/$1'" },
    { from: /from '\.\.\/infrastructure\/([^']+)'/g, to: "from '@/infrastructure/$1'" },
    
    // Presentation imports
    { from: /from '\.\.\/\.\.\/\.\.\/presentation\/([^']+)'/g, to: "from '@/presentation/$1'" },
    { from: /from '\.\.\/\.\.\/presentation\/([^']+)'/g, to: "from '@/presentation/$1'" },
    { from: /from '\.\.\/presentation\/([^']+)'/g, to: "from '@/presentation/$1'" },
    { from: /from '\.\.\/([^']+)'/g, to: "from '@/presentation/$1'" }
  ];

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Restored path aliases in: ${filePath}`);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      restorePathAliases(filePath);
    }
  });
}

console.log('🔧 Restoring path aliases...');
walkDirectory('./src');
console.log('✅ Path aliases restored!');