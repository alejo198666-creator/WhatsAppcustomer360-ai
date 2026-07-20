/**
 * ==========================================================
 * conversationState.js
 * ----------------------------------------------------------
 * Mantiene el estado actual de la conversación.
 *
 * En una futura versión, este estado será administrado por
 * FastAPI y persistido en SQL Server.
 * ==========================================================
 */

/**
 * Crea la estructura inicial de una venta.
 *
 * Usar una función evita repetir estructuras diferentes
 * cuando se inicia o reinicia la conversación.
 *
 * @returns {Object}
 */
export function createInitialSaleState() {

    return {
        cliente: null,
        carrito: [],
        productoSeleccionado: null,

        subtotal: 0,
        iva: 0,
        descuento: 0,
        total: 0,

        pedidoId: null
    };

}

/**
 * Estado global temporal de la conversación.
 */
export const conversation = {

    //---------------------------------------------------------
    // Flujo activo: cliente, venta, pedido o null
    //---------------------------------------------------------
    flow: null,

    //---------------------------------------------------------
    // Paso actual dentro del flujo
    //---------------------------------------------------------
    step: null,

    //---------------------------------------------------------
    // Cliente en proceso de registro
    //---------------------------------------------------------
    cliente: {},

    //---------------------------------------------------------
    // Venta en construcción
    //---------------------------------------------------------
    venta: createInitialSaleState(),

    //---------------------------------------------------------
    // Pedido consultado o recién generado
    //---------------------------------------------------------
    pedido: null

};

/**
 * Reinicia completamente la conversación.
 */
export function resetConversation() {

    conversation.flow = null;
    conversation.step = null;
    conversation.cliente = {};
    conversation.venta = createInitialSaleState();
    conversation.pedido = null;

}