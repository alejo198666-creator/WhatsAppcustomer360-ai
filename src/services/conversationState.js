/**
 * ==========================================================
 * conversationState.js
 * ----------------------------------------------------------
 * Mantiene el estado actual de la conversación del chatbot.
 *
 * En una futura versión este estado será administrado por
 * una API (FastAPI) y persistido en SQL Server.
 *
 * Mientras tanto, funciona como una sesión en memoria.
 * ==========================================================
 */

export const conversation = {

    //---------------------------------------------------------
    // Flujo activo
    //---------------------------------------------------------
    // null
    // cliente
    // venta
    // pedido
    //---------------------------------------------------------
    flow: null,

    //---------------------------------------------------------
    // Paso actual dentro del flujo
    //---------------------------------------------------------
    step: null,

    //---------------------------------------------------------
    // Cliente que se está registrando
    //---------------------------------------------------------
    cliente: {},

    //---------------------------------------------------------
    // Venta en construcción
    //---------------------------------------------------------
    venta:{

    cliente:null,

    carrito:[],

    productoSeleccionado:null,

    subtotal:0,

    total:0,

    pedidoId:null

},

    //---------------------------------------------------------
    // Pedido consultado
    //---------------------------------------------------------
    pedido: null

};


/**
 * Reinicia completamente la conversación.
 */
export function resetConversation(){

    conversation.flow = null;

    conversation.step = null;

    conversation.cliente = {};

    conversation.venta = {

        cliente:null,

        productos:[],

        total:0

    };

    conversation.pedido = null;

}