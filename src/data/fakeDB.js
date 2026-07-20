/**
 * ===========================================================
 * fakeDB.js
 * -----------------------------------------------------------
 * Base de datos temporal en memoria.
 *
 * En futuras versiones estas colecciones serán reemplazadas
 * por tablas de SQL Server consultadas mediante FastAPI.
 * ===========================================================
 */

/**
 * Clientes registrados.
 */
export const clientes = [];

/**
 * Pedidos generados.
 */
export const pedidos = [];