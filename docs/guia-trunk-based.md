# Guía de trabajo Trunk-Based Development – Dulce Arte

## 1. Regla principal
Todo el código se integra en la rama **main** al menos una vez al día. La rama main siempre debe
estar lista para desplegarse.

## 2. Ramas cortas
- Duración máxima: **24 horas**.
- Nombres permitidos:
  - `feature/<descripcion>` para funcionalidades nuevas.
  - `fix/<descripcion>` para correcciones no urgentes.
  - `hotfix/<descripcion>` para correcciones urgentes de producción.

## 3. Mensajes de commit
Formato: `<tipo>: <descripción breve> (#<issue>)`

Tipos: `feat`, `fix`, `test`, `docs`, `ci`, `chore`. Ejemplo: `test: agrega pruebas del inventario (#7)`.

## 4. Pull requests y revisión
1. Todo cambio llega a main mediante un pull request.
2. La descripción del pull request incluye `Closes #<issue>` para cerrar el issue automáticamente.
3. Los cuatro flujos de CI deben terminar en verde.
4. El otro integrante revisa y aprueba el cambio (columna Code Review del tablero).

## 5. Feature flags
Las funcionalidades incompletas se integran a main desactivadas en `config/flags.json` y se activan
cuando están terminadas y probadas. Así se separa el despliegue del código de la liberación de la
funcionalidad.

## 6. Hotfix
1. Registrar el bug como issue con los pasos para reproducirlo.
2. Crear la rama `hotfix/<descripcion>` desde main.
3. Agregar primero una prueba que detecte el error (el CI debe fallar).
4. Corregir el código hasta que el CI termine en verde.
5. Revisar, integrar a main y verificar el despliegue.

## 7. Reversión (rollback)
Si un cambio integrado provoca un fallo, se revierte con el botón **Revert** del pull request en
GitHub (equivale a `git revert`). El despliegue continuo publica de nuevo la versión estable.
