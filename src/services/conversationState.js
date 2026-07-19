/**
 * ==========================================================
 * conversationState.js
 * ----------------------------------------------------------
 * Mantiene el estado actual de la conversación del chatbot.
 *
 * En una futura versión este estado será administrado por
 * FastAPI y persistido en SQL Server.
 * ==========================================================
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
    venta: {
        cliente: null,
        carrito: [],
        productoSeleccionado: null,
        subtotal: 0,
        total: 0,
        pedidoId: null
    },

    //---------------------------------------------------------
    // Pedido consultado
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

    conversation.venta = {
        cliente: null,
        carrito: [],
        productoSeleccionado: null,
        subtotal: 0,
        total: 0,
        pedidoId: null
    };

    conversation.pedido = null;

}