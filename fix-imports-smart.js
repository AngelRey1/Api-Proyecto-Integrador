const fs = require('fs');
const path = require('path');

function calculateRelativePath(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  const relativePath = path.relative(fromDir, toFile);
  return relativePath.replace(/\\/g, '/');
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Mapeo de imports a sus rutas reales
  const importMappings = {
    '@/shared/config/environment': 'src/shared/config/environment',
    '@/shared/types/api': 'src/shared/types/api',
    '@/shared/utils/response': 'src/shared/utils/response',
    '@/shared/middleware/auth': 'src/shared/middleware/auth',
    '@/domain/': 'src/domain/',
    '@/application/': 'src/application/',
    '@/infrastructure/': 'src/infrastructure/',
    '@/presentation/': 'src/presentation/'
  };

  Object.entries(importMappings).forEach(([alias, realPath]) => {
    const regex = new RegExp(`from '${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^']*)'`, 'g');
    
    content = content.replace(regex, (match, subPath) => {
      const fullTargetPath = realPath + (subPath || '');
      const relativePath = calculateRelativePath(filePath, fullTargetPath);
      const finalPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
      modified = true;
      return `from '${finalPath}'`;
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
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
      fixImportsInFile(filePath);
    }
  });
}

console.log('🔧 Fixing imports with correct relative paths...');
walkDirectory('./src');
console.log('✅ All imports fixed!');