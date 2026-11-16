// Módulo de Gestión de Inventario de Insumos – Dulce Arte S.A.C.
// Reglas de negocio de stock mínimo, reabastecimiento y vencimiento de insumos.

export const DIAS_ALERTA_VENCIMIENTO = 7;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function necesitaReabastecer(insumo) {
  return insumo.stock <= insumo.stockMinimo;
}

// Cantidad que se debe pedir para llegar al doble del stock mínimo.
export function cantidadAReponer(insumo) {
  if (!necesitaReabastecer(insumo)) {
    return 0;
  }
  return insumo.stockMinimo * 2 - insumo.stock;
}

export function diasParaVencer(fechaVencimiento, hoy) {
  const inicio = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const fin = Date.UTC(
    fechaVencimiento.getFullYear(),
    fechaVencimiento.getMonth(),
    fechaVencimiento.getDate()
  );
  return Math.round((fin - inicio) / MS_POR_DIA);
}

export function estadoVencimiento(insumo, hoy) {
  if (!insumo.vence) {
    return 'no perecible';
  }
  const dias = diasParaVencer(insumo.vence, hoy);
  if (dias < 0) {
    return 'vencido';
  }
  if (dias <= DIAS_ALERTA_VENCIMIENTO) {
    return 'por vencer';
  }
  return 'vigente';
}

export function registrarSalida(insumo, cantidad) {
  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    throw new Error('La cantidad de salida debe ser mayor que cero');
  }
  if (cantidad > insumo.stock) {
    throw new Error(`Stock insuficiente de ${insumo.nombre}`);
  }
  return { ...insumo, stock: insumo.stock - cantidad };
}

// Datos de demostración (ficticios). Las fechas se calculan a partir de "hoy"
// para que las alertas de vencimiento se vean siempre en el prototipo.
export function insumosDemo(hoy) {
  const enDias = (n) => new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + n);
  return [
    { id: 'I01', nombre: 'Harina preparada', unidad: 'kg', stock: 18, stockMinimo: 25, vence: enDias(120) },
    { id: 'I02', nombre: 'Azúcar blanca', unidad: 'kg', stock: 30, stockMinimo: 15, vence: null },
    { id: 'I03', nombre: 'Mantequilla', unidad: 'kg', stock: 6, stockMinimo: 8, vence: enDias(5) },
    { id: 'I04', nombre: 'Leche evaporada', unidad: 'latas', stock: 48, stockMinimo: 24, vence: enDias(140) },
    { id: 'I05', nombre: 'Huevos', unidad: 'und.', stock: 120, stockMinimo: 180, vence: enDias(12) },
    { id: 'I06', nombre: 'Cobertura de chocolate', unidad: 'kg', stock: 4, stockMinimo: 5, vence: enDias(3) },
    { id: 'I07', nombre: 'Fresas', unidad: 'kg', stock: 3, stockMinimo: 4, vence: enDias(-1) },
    { id: 'I08', nombre: 'Cajas para torta', unidad: 'und.', stock: 40, stockMinimo: 30, vence: null },
  ];
}
