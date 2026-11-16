// Pruebas automatizadas del módulo de catálogo (se ejecutan con: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTOS,
  filtrarPorCategoria,
  buscarProductos,
  formatearPrecio,
  aplicarDescuento,
  cotizarTortaTematica,
} from '../catalogo/catalogo.js';

test('filtra los productos de una categoría', () => {
  const postres = filtrarPorCategoria(PRODUCTOS, 'Postres');
  assert.equal(postres.length, 3);
  assert.ok(postres.every((p) => p.categoria === 'Postres'));
});

test('la categoría "Todas" devuelve el catálogo completo', () => {
  assert.equal(filtrarPorCategoria(PRODUCTOS, 'Todas').length, PRODUCTOS.length);
});

test('la búsqueda ignora mayúsculas y tildes', () => {
  const resultado = buscarProductos(PRODUCTOS, 'TURRON');
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, 'P09');
});

test('el precio se muestra en soles con dos decimales', () => {
  assert.equal(formatearPrecio(4.5), 'S/ 4.50');
});

test('aplica un descuento porcentual al precio', () => {
  assert.equal(aplicarDescuento(65, 10), 58.5);
});

test('rechaza descuentos fuera del rango de 0 a 100 %', () => {
  assert.throws(() => aplicarDescuento(65, 120));
});

test('cotiza una torta temática según porciones y decoración', () => {
  assert.equal(cotizarTortaTematica(20, 'media'), 120);
});

test('rechaza tortas temáticas con menos de 10 porciones', () => {
  assert.throws(() => cotizarTortaTematica(5, 'simple'));
});
