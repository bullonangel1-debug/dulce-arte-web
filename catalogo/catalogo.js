// Módulo de Catálogo y Pedidos Online – Dulce Arte S.A.C.
// Reglas de negocio del catálogo de productos y de la cotización de tortas temáticas.

export const CATEGORIAS = ['Panadería', 'Pastelería', 'Postres', 'Salados'];

export const PRODUCTOS = [
  { id: 'P01', nombre: 'Pan de yema', categoria: 'Panadería', precio: 0.5 },
  { id: 'P02', nombre: 'Chancay', categoria: 'Panadería', precio: 1.5 },
  { id: 'P03', nombre: 'Croissant de mantequilla', categoria: 'Panadería', precio: 4.5 },
  { id: 'P04', nombre: 'Torta de chocolate (entera)', categoria: 'Pastelería', precio: 65 },
  { id: 'P05', nombre: 'Cheesecake de fresa (entero)', categoria: 'Pastelería', precio: 70 },
  { id: 'P06', nombre: 'Pie de manzana (entero)', categoria: 'Pastelería', precio: 45 },
  { id: 'P07', nombre: 'Tres leches (porción)', categoria: 'Postres', precio: 9 },
  { id: 'P08', nombre: 'Alfajores (caja de 6)', categoria: 'Postres', precio: 12 },
  { id: 'P09', nombre: 'Turrón de Doña Pepa', categoria: 'Postres', precio: 25 },
  { id: 'P10', nombre: 'Empanada de pollo', categoria: 'Salados', precio: 6 },
];

// Convierte un texto a minúsculas y sin tildes para comparar búsquedas.
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function filtrarPorCategoria(productos, categoria) {
  if (!categoria || categoria === 'Todas') {
    return [...productos];
  }
  return productos.filter((p) => p.categoria === categoria);
}

export function buscarProductos(productos, texto) {
  const consulta = normalizar(texto).trim();
  if (consulta === '') {
    return [...productos];
  }
  return productos.filter((p) => normalizar(p.nombre).includes(consulta));
}

export function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

export function formatearPrecio(valor) {
  return `S/ ${valor.toFixed(2)}`;
}

export function aplicarDescuento(precio, porcentaje) {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error('El descuento debe estar entre 0 y 100 %');
  }
  return redondear(precio * (1 - porcentaje / 100));
}

// Cotización de tortas temáticas (funcionalidad controlada por el feature flag
// "reservaTortasTematicas" del archivo config/flags.json).
export const PRECIO_POR_PORCION = 4.5;
export const RECARGO_DECORACION = { simple: 0, media: 30, alta: 60 };

export function cotizarTortaTematica(porciones, decoracion) {
  if (!Number.isInteger(porciones) || porciones < 10 || porciones > 100) {
    throw new Error('Las tortas temáticas se preparan de 10 a 100 porciones');
  }
  if (!(decoracion in RECARGO_DECORACION)) {
    throw new Error('Nivel de decoración no válido');
  }
  return redondear(porciones * PRECIO_POR_PORCION + RECARGO_DECORACION[decoracion]);
}
