// Pruebas automatizadas del módulo de ventas (se ejecutan con: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subtotalVenta, cierreDeCaja } from '../ventas/ventas.js';

test('calcula el subtotal de una venta con varios productos', () => {
  const venta = {
    metodoPago: 'efectivo',
    items: [
      { producto: 'Pan de yema', cantidad: 20, precio: 0.5 },
      { producto: 'Chancay', cantidad: 4, precio: 1.5 },
    ],
  };
  assert.equal(subtotalVenta(venta), 16);
});

test('el cierre de caja suma los pagos en efectivo y con tarjeta', () => {
  const ventas = [
    { metodoPago: 'efectivo', items: [{ producto: 'Empanada', cantidad: 5, precio: 6 }] },
    { metodoPago: 'tarjeta', items: [{ producto: 'Torta', cantidad: 1, precio: 65 }] },
  ];
  const cierre = cierreDeCaja(ventas);
  assert.equal(cierre.efectivo, 30);
  assert.equal(cierre.tarjeta, 65);
  assert.equal(cierre.total, 95);
  assert.equal(cierre.cantidadVentas, 2);
});

test('el cierre de caja rechaza métodos de pago no válidos', () => {
  const ventas = [{ metodoPago: 'cheque', items: [{ producto: 'Torta', cantidad: 1, precio: 65 }] }];
  assert.throws(() => cierreDeCaja(ventas));
});


test('el total del cierre de caja incluye los pagos con Yape', () => {
  const ventas = [
    { metodoPago: 'efectivo', items: [{ producto: 'Empanada', cantidad: 5, precio: 6 }] },
    { metodoPago: 'tarjeta', items: [{ producto: 'Torta', cantidad: 1, precio: 65 }] },
    { metodoPago: 'yape', items: [{ producto: 'Turrón', cantidad: 1, precio: 25 }] },
  ];
  const cierre = cierreDeCaja(ventas);
  assert.equal(cierre.yape, 25);
  assert.equal(cierre.total, 120);
});
