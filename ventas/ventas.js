// Módulo de Ventas y Comprobantes – Dulce Arte S.A.C.
// Reglas de negocio del registro de ventas y del cierre de caja diario.

export const METODOS_PAGO = ['efectivo', 'tarjeta', 'yape'];

function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

export function subtotalVenta(venta) {
  return redondear(
    venta.items.reduce((suma, item) => suma + item.cantidad * item.precio, 0)
  );
}

export function cierreDeCaja(ventas) {
  const resumen = { efectivo: 0, tarjeta: 0, yape: 0 };
  for (const venta of ventas) {
    if (!METODOS_PAGO.includes(venta.metodoPago)) {
      throw new Error(`Método de pago no válido: ${venta.metodoPago}`);
    }
    resumen[venta.metodoPago] += subtotalVenta(venta);
  }
  return {
    efectivo: redondear(resumen.efectivo),
    tarjeta: redondear(resumen.tarjeta),
    yape: redondear(resumen.yape),
    total: redondear(resumen.efectivo + resumen.tarjeta + resumen.yape),
    cantidadVentas: ventas.length,
  };
}

// Ventas de demostración (ficticias) de un día de atención.
export const VENTAS_DEMO = [
  { id: 'V001', hora: '08:15', metodoPago: 'efectivo', items: [{ producto: 'Pan de yema', cantidad: 20, precio: 0.5 }, { producto: 'Chancay', cantidad: 4, precio: 1.5 }] },
  { id: 'V002', hora: '09:40', metodoPago: 'yape', items: [{ producto: 'Croissant de mantequilla', cantidad: 3, precio: 4.5 }] },
  { id: 'V003', hora: '10:05', metodoPago: 'tarjeta', items: [{ producto: 'Torta de chocolate (entera)', cantidad: 1, precio: 65 }] },
  { id: 'V004', hora: '11:30', metodoPago: 'yape', items: [{ producto: 'Tres leches (porción)', cantidad: 2, precio: 9 }, { producto: 'Alfajores (caja de 6)', cantidad: 1, precio: 12 }] },
  { id: 'V005', hora: '13:10', metodoPago: 'efectivo', items: [{ producto: 'Empanada de pollo', cantidad: 5, precio: 6 }] },
  { id: 'V006', hora: '16:45', metodoPago: 'tarjeta', items: [{ producto: 'Cheesecake de fresa (entero)', cantidad: 1, precio: 70 }] },
  { id: 'V007', hora: '18:20', metodoPago: 'yape', items: [{ producto: 'Turrón de Doña Pepa', cantidad: 1, precio: 25 }] },
];
