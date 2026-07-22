/**
 * ===========================================================
 * orderStatus.js
 * -----------------------------------------------------------
 * Catálogo centralizado de estados de pedido.
 *
 * Este archivo evita escribir directamente textos como:
 *
 * "Pendiente"
 * "Confirmado"
 * "En preparación"
 *
 * en diferentes partes del proyecto.
 *
 * De esta forma:
 *
 * - se reducen errores de escritura;
 * - todos los módulos utilizan los mismos estados;
 * - las reglas pueden mantenerse desde un único lugar;
 * - la interfaz administrativa podrá reutilizar este catálogo.
 * ===========================================================
 */

/**
 * Estados oficiales disponibles para los pedidos.
 */
export const ORDER_STATUS = Object.freeze({
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    PREPARING: "En preparación",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado"
});

/**
 * Lista con todos los estados válidos.
 *
 * Puede utilizarse para:
 *
 * - llenar selectores;
 * - validar estados;
 * - mostrar opciones administrativas.
 */
export const ORDER_STATUS_LIST = Object.freeze(
    Object.values(ORDER_STATUS)
);

/**
 * Indica si un valor corresponde a un estado de pedido válido.
 *
 * @param {string} status
 * @returns {boolean}
 */
export function isValidOrderStatus(status) {

    return ORDER_STATUS_LIST.includes(status);

}