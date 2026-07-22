/**
 * ===========================================================
 * fakeDB.js
 * -----------------------------------------------------------
 * Base de datos temporal en memoria.
 *
 * Al iniciar la aplicación, recupera automáticamente los
 * clientes y pedidos almacenados en localStorage.
 *
 * En una futura versión estas colecciones serán reemplazadas
 * por datos obtenidos desde FastAPI y SQL Server.
 * ===========================================================
 */

import {
    loadClientes,
    loadPedidos
} from "../services/storage/storageService.js";

/**
 * Clientes registrados.
 *
 * La colección comienza con los clientes previamente
 * almacenados en localStorage.
 */
export const clientes = loadClientes();

/**
 * Pedidos generados.
 *
 * La colección comienza con los pedidos previamente
 * almacenados en localStorage.
 */
export const pedidos = loadPedidos();