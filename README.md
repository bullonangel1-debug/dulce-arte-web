# dulce-arte-web

Prototipo del sistema web de pedidos e inventario de **Panadería y Pastelería "Dulce Arte" S.A.C.**
Proyecto académico del curso Herramientas de Desarrollo (UTP) sobre gestión de versiones con
**Trunk-Based Development** e integración y despliegue continuos (CI/CD) con **GitHub Actions**.

> Todos los datos del prototipo son ficticios.

## Módulos

| Carpeta | Módulo | Reglas de negocio |
|---|---|---|
| `catalogo/` | Catálogo y pedidos online | Búsqueda, filtros, descuentos y cotización de tortas temáticas |
| `inventario/` | Inventario de insumos | Stock mínimo, cantidad a reponer y alertas de vencimiento |
| `ventas/` | Ventas y comprobantes | Subtotales y cierre de caja por método de pago |

## Flujo de trabajo (Trunk-Based Development)

1. Cada cambio se hace en una rama corta (`feature/...`, `fix/...` o `hotfix/...`) que vive menos de 24 horas.
2. Se abre un pull request hacia `main` que menciona su issue (por ejemplo, `Closes #7`).
3. Se ejecutan los cuatro flujos de integración continua (CI).
4. El otro integrante revisa el código (columna **Code Review** del tablero).
5. Al integrar a `main`, el flujo de despliegue continuo (CD) publica el sitio en GitHub Pages.

## Integración y despliegue continuos

| Archivo | Flujo | Cuándo se ejecuta |
|---|---|---|
| `.github/workflows/ci-pruebas.yml` | CI 1 · Pruebas unitarias | Push y pull request a `main` |
| `.github/workflows/ci-calidad.yml` | CI 2 · Calidad del código | Push y pull request a `main` |
| `.github/workflows/ci-configuracion.yml` | CI 3 · Estructura y configuración | Push y pull request a `main` |
| `.github/workflows/ci-trazabilidad.yml` | CI 4 · Trazabilidad con issues | Pull request a `main` |
| `.github/workflows/cd-pages.yml` | CD · Despliegue en GitHub Pages | Push a `main` |

## Cómo probar en una computadora

```bash
npm test          # ejecuta las pruebas automatizadas (Node.js 20 o superior)
npm run validar   # valida la estructura y los feature flags
```

Para ver el sitio, abre la carpeta con un servidor local (por ejemplo, la extensión Live Server de VS Code).

## Feature flags

El archivo `config/flags.json` activa o desactiva funcionalidades sin volver a programar:

```json
{ "reservaTortasTematicas": false }
```
