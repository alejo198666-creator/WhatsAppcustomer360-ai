/**
 * ===========================================================
 * generateOrderId.js
 * -----------------------------------------------------------
 * Genera identificadores consecutivos persistentes.
 *
 * Ejemplos:
 *
 * PED-000001
 * PED-000002
 * PED-000003
 *
 * El consecutivo se conserva en localStorage, por lo que no
 * vuelve a cero al recargar o cerrar el navegador.
 *
 * En una versión con SQL Server, el consecutivo será generado
 * por la base de datos o por el backend FastAPI.
 * ===========================================================
 */

import {
    nextOrderSequence,
    saveOrderSequence
} from "../storage/storageService.js";

/**
 * Genera el siguiente identificador de pedido.
 *
 * @returns {string}
 */
export function generateOrderId() {

    const sequence =
        nextOrderSequence();

    const paddedSequence =
        String(sequence).padStart(
            6,
            "0"
        );

    return `PED-${paddedSequence}`;

}

/**
 * Reinicia el consecutivo.
 *
 * Se utiliza principalmente durante las pruebas automatizadas.
 */
export function resetOrderSequence() {

    saveOrderSequence(0);

}