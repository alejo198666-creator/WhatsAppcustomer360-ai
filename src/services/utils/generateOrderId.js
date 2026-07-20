/**
 * ===========================================================
 * generateOrderId.js
 * -----------------------------------------------------------
 * Genera identificadores consecutivos para los pedidos.
 *
 * Ejemplos:
 *
 * PED-000001
 * PED-000002
 * PED-000003
 *
 * En una versión con SQL Server, el consecutivo será generado
 * por la base de datos o por el backend FastAPI.
 * ===========================================================
 */

let orderSequence = 0;

/**
 * Genera el siguiente identificador de pedido.
 *
 * @returns {string}
 */
export function generateOrderId() {

    orderSequence += 1;

    const paddedSequence = String(orderSequence).padStart(
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

    orderSequence = 0;

}