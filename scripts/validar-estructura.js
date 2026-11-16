// Validación de la estructura y configuración del proyecto (usada por el CI 3).
// Revisa que existan los archivos obligatorios, que los feature flags sean válidos,
// que el catálogo no tenga precios incorrectos y que no se suban credenciales.
import { existsSync, readFileSync } from 'node:fs';
import { PRODUCTOS } from '../catalogo/catalogo.js';

const errores = [];

const obligatorios = [
  'index.html',
  'styles.css',
  'app.js',
  'catalogo/catalogo.js',
  'inventario/inventario.js',
  'ventas/ventas.js',
  'config/flags.json',
  'README.md',
];
for (const archivo of obligatorios) {
  if (!existsSync(archivo)) {
    errores.push(`Falta el archivo obligatorio: ${archivo}`);
  }
}

// 1. Los feature flags deben ser un JSON válido con valores verdadero/falso.
try {
  const flags = JSON.parse(readFileSync('config/flags.json', 'utf8'));
  for (const [nombre, valor] of Object.entries(flags)) {
    if (typeof valor !== 'boolean') {
      errores.push(`El flag "${nombre}" debe ser true o false`);
    }
  }
} catch (error) {
  errores.push(`config/flags.json no es un JSON válido: ${error.message}`);
}

// 2. Los productos del catálogo deben tener código único y precio mayor que cero.
const codigos = new Set();
for (const producto of PRODUCTOS) {
  if (codigos.has(producto.id)) {
    errores.push(`Código de producto repetido: ${producto.id}`);
  }
  codigos.add(producto.id);
  if (!(producto.precio > 0)) {
    errores.push(`Precio no válido en el producto ${producto.id}`);
  }
}

// 3. No se deben subir archivos con credenciales.
if (existsSync('.env')) {
  errores.push('El archivo .env no debe subirse al repositorio');
}

if (errores.length > 0) {
  console.error('Validación con errores:');
  errores.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`Estructura y configuración correctas (${obligatorios.length} archivos, ${PRODUCTOS.length} productos).`);
