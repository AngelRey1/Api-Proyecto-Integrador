const fs = require('fs');
const path = require('path');

// Archivos a arreglar
const files = [
  'src/presentation/controllers/final/PagoFinalController.ts',
  'src/presentation/controllers/final/ReservaFinalController.ts',
  'src/presentation/controllers/final/ReseñaFinalController.ts'
];

files.forEach(filePath => {
  console.log(`Arreglando ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar todos los "return res.status(" por "res.status(" y agregar "return;" en la siguiente línea
  content = content.replace(/(\s+)return res\.status\((\d+)\)\.json\(\{/g, (match, indent, statusCode) => {
    return `${indent}res.status(${statusCode}).json({`;
  });
  
  // Agregar return; después de cada }); que cierra un json de error
  content = content.replace(/(\s+)\}\);\s*$/gm, (match, indent) => {
    // Solo agregar return si la línea anterior no es ya un return
    if (!content.substring(0, content.indexOf(match)).endsWith('return;\n')) {
      return `${indent}});${indent}return;`;
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filePath} arreglado`);
});

console.log('🎉 Todos los archivos han sido arreglados');