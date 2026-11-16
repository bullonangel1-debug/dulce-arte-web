// Interfaz del prototipo: conecta los módulos de negocio con la página.
import {
  CATEGORIAS,
  PRODUCTOS,
  filtrarPorCategoria,
  buscarProductos,
  formatearPrecio,
  cotizarTortaTematica,
} from './catalogo/catalogo.js';
import {
  insumosDemo,
  necesitaReabastecer,
  cantidadAReponer,
  diasParaVencer,
  estadoVencimiento,
} from './inventario/inventario.js';
import { VENTAS_DEMO, subtotalVenta, cierreDeCaja } from './ventas/ventas.js';

const $ = (selector) => document.querySelector(selector);

// ---------- Navegación entre módulos ----------
function mostrarModulo(nombre) {
  document.querySelectorAll('.pestana').forEach((boton) => {
    boton.classList.toggle('activa', boton.dataset.modulo === nombre);
  });
  document.querySelectorAll('.modulo').forEach((seccion) => {
    seccion.classList.toggle('activo', seccion.id === `modulo-${nombre}`);
  });
}

document.querySelectorAll('.pestana').forEach((boton) => {
  boton.addEventListener('click', () => mostrarModulo(boton.dataset.modulo));
});

// ---------- Catálogo ----------
function pintarCatalogo() {
  const categoria = $('#categoria').value;
  const texto = $('#buscar').value;
  const productos = buscarProductos(filtrarPorCategoria(PRODUCTOS, categoria), texto);
  $('#lista-productos').innerHTML = productos
    .map(
      (p) => `
      <article class="tarjeta">
        <span class="categoria">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <span class="precio">${formatearPrecio(p.precio)}</span>
      </article>`
    )
    .join('');
  $('#sin-resultados').hidden = productos.length > 0;
}

$('#categoria').innerHTML = ['Todas', ...CATEGORIAS]
  .map((c) => `<option value="${c}">${c}</option>`)
  .join('');
$('#categoria').addEventListener('change', pintarCatalogo);
$('#buscar').addEventListener('input', pintarCatalogo);
pintarCatalogo();

// ---------- Inventario ----------
const ETIQUETA_VENCIMIENTO = {
  vigente: 'ok',
  'por vencer': 'alerta',
  vencido: 'peligro',
  'no perecible': 'neutra',
};

function pintarInventario() {
  const hoy = new Date();
  const insumos = insumosDemo(hoy);
  const porReponer = insumos.filter(necesitaReabastecer).length;
  const porVencer = insumos.filter((i) => estadoVencimiento(i, hoy) === 'por vencer').length;
  const vencidos = insumos.filter((i) => estadoVencimiento(i, hoy) === 'vencido').length;

  $('#indicadores-inventario').innerHTML = `
    <div class="indicador"><strong>${insumos.length}</strong><span>insumos registrados</span></div>
    <div class="indicador"><strong>${porReponer}</strong><span>por debajo del stock mínimo</span></div>
    <div class="indicador"><strong>${porVencer}</strong><span>por vencer en 7 días</span></div>
    <div class="indicador"><strong>${vencidos}</strong><span>vencidos</span></div>`;

  $('#tabla-insumos').innerHTML = insumos
    .map((i) => {
      const estado = estadoVencimiento(i, hoy);
      const dias = i.vence ? diasParaVencer(i.vence, hoy) : null;
      const plural = (n) => (Math.abs(n) === 1 ? 'día' : 'días');
      let detalle = estado;
      if (dias !== null) {
        detalle = dias < 0 ? `${estado} (hace ${-dias} ${plural(dias)})` : `${estado} (${dias} ${plural(dias)})`;
      }
      const reponer = cantidadAReponer(i);
      return `
      <tr>
        <td>${i.nombre}</td>
        <td>${i.stock} ${i.unidad}</td>
        <td>${i.stockMinimo} ${i.unidad}</td>
        <td>${reponer > 0 ? `<span class="etiqueta alerta">${reponer} ${i.unidad}</span>` : '—'}</td>
        <td><span class="etiqueta ${ETIQUETA_VENCIMIENTO[estado]}">${detalle}</span></td>
      </tr>`;
    })
    .join('');
}
pintarInventario();

// ---------- Ventas y cierre de caja ----------
function pintarVentas() {
  $('#tabla-ventas').innerHTML = VENTAS_DEMO.map(
    (v) => `
      <tr>
        <td>${v.id}</td>
        <td>${v.hora}</td>
        <td class="detalle">${v.items.map((it) => `${it.cantidad} × ${it.producto}`).join(', ')}</td>
        <td>${v.metodoPago}</td>
        <td>${formatearPrecio(subtotalVenta(v))}</td>
      </tr>`
  ).join('');

  const cierre = cierreDeCaja(VENTAS_DEMO);
  $('#resumen-cierre').innerHTML = `
    <dt>Ventas registradas</dt><dd>${cierre.cantidadVentas}</dd>
    <dt>Efectivo</dt><dd>${formatearPrecio(cierre.efectivo)}</dd>
    <dt>Tarjeta</dt><dd>${formatearPrecio(cierre.tarjeta)}</dd>
    <dt>Yape</dt><dd>${formatearPrecio(cierre.yape)}</dd>
    <dt class="total">Total del día</dt><dd class="total">${formatearPrecio(cierre.total)}</dd>`;

  // Verificación independiente: suma directa de las ventas registradas.
  const sumaVentas = VENTAS_DEMO.reduce((suma, v) => suma + subtotalVenta(v), 0);
  const estado = $('#estado-cuadre');
  if (Math.abs(sumaVentas - cierre.total) < 0.01) {
    estado.className = 'cuadre correcto';
    estado.textContent = 'Cuadre correcto: el total coincide con la suma de las ventas.';
  } else {
    estado.className = 'cuadre descuadre';
    estado.textContent = `Descuadre: las ventas suman ${formatearPrecio(sumaVentas)} y el cierre muestra ${formatearPrecio(cierre.total)}.`;
  }
}
pintarVentas();

// ---------- Reserva de tortas temáticas (feature flag) ----------
$('#form-reserva').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const resultado = $('#resultado-reserva');
  try {
    const precio = cotizarTortaTematica(Number($('#porciones').value), $('#decoracion').value);
    resultado.textContent = `Torta "${$('#tematica').value}": precio estimado ${formatearPrecio(precio)} (demostración).`;
  } catch (error) {
    resultado.textContent = error.message;
  }
});

async function aplicarFlags() {
  try {
    const respuesta = await fetch('config/flags.json', { cache: 'no-store' });
    const flags = await respuesta.json();
    $('#pestana-reservas').hidden = !flags.reservaTortasTematicas;
  } catch {
    $('#pestana-reservas').hidden = true;
  }
}
aplicarFlags();
