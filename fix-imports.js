const fs = require('fs');
const path = require('path');

function replaceImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Reemplazar imports de @/shared
  if (content.includes("from '@/shared")) {
    content = content.replace(/from '@\/shared\//g, "from '../../../shared/");
    modified = true;
  }

  // Reemplazar imports de @/presentation
  if (content.includes("from '@/presentation")) {
    content = content.replace(/from '@\/presentation\//g, "from '../");
    modified = true;
  }

  // Reemplazar imports de @/application
  if (content.includes("from '@/application")) {
    content = content.replace(/from '@\/application\//g, "from '../../application/");
    modified = true;
  }

  // Reemplazar imports de @/infrastructure
  if (content.includes("from '@/infrastructure")) {
    content = content.replace(/from '@\/infrastructure\//g, "from '../../infrastructure/");
    modified = true;
  }

  // Reemplazar imports de @/domain
  if (content.includes("from '@/domain")) {
    content = content.replace(/from '@\/domain\//g, "from '../../domain/");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${filePath}`);
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
      replaceImportsInFile(filePath);
    }
  });
}

console.log('🔧 Fixing path aliases to relative imports...');
walkDirectory('./src');
console.log('✅ All imports fixed!');