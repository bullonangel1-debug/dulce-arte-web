// Pruebas automatizadas del módulo de inventario (se ejecutan con: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  necesitaReabastecer,
  cantidadAReponer,
  diasParaVencer,
  estadoVencimiento,
  registrarSalida,
} from '../inventario/inventario.js';

const hoy = new Date(2026, 10, 16); // 16 de noviembre de 2026
const harina = { nombre: 'Harina', stock: 18, stockMinimo: 25, vence: null };
const azucar = { nombre: 'Azúcar', stock: 30, stockMinimo: 15, vence: null };

test('detecta un insumo por debajo del stock mínimo', () => {
  assert.equal(necesitaReabastecer(harina), true);
  assert.equal(necesitaReabastecer(azucar), false);
});

test('calcula la cantidad a reponer hasta el doble del stock mínimo', () => {
  assert.equal(cantidadAReponer(harina), 32);
  assert.equal(cantidadAReponer(azucar), 0);
});

test('calcula los días que faltan para el vencimiento', () => {
  assert.equal(diasParaVencer(new Date(2026, 10, 21), hoy), 5);
});

test('marca como "por vencer" un insumo que vence en 7 días o menos', () => {
  const mantequilla = { nombre: 'Mantequilla', stock: 6, stockMinimo: 8, vence: new Date(2026, 10, 20) };
  assert.equal(estadoVencimiento(mantequilla, hoy), 'por vencer');
});

test('marca como "vencido" un insumo con fecha pasada', () => {
  const fresas = { nombre: 'Fresas', stock: 3, stockMinimo: 4, vence: new Date(2026, 10, 15) };
  assert.equal(estadoVencimiento(fresas, hoy), 'vencido');
});

test('un insumo sin fecha de vencimiento es "no perecible"', () => {
  assert.equal(estadoVencimiento(azucar, hoy), 'no perecible');
});

test('registra una salida y descuenta el stock', () => {
  assert.equal(registrarSalida(azucar, 5).stock, 25);
});

test('rechaza salidas con cantidad cero o negativa', () => {
  assert.throws(() => registrarSalida(azucar, 0));
  assert.throws(() => registrarSalida(azucar, -3));
});

test('rechaza salidas mayores que el stock disponible', () => {
  assert.throws(() => registrarSalida(harina, 50));
});
