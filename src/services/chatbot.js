/**
 * ===========================================================
 * chatbot.js
 * -----------------------------------------------------------
 * Orquestador principal del motor conversacional.
 *
 * Responsabilidades:
 *
 * - Detectar si existe un flujo activo.
 * - Delegar la entrada al flujo correspondiente.
 * - Detectar comandos nuevos.
 * - Consultar las intenciones generales.
 * - Devolver siempre un MessageModel.
 * ===========================================================
 */

import intents from "../data/intents.js";

import {
    conversation
} from "./conversationState.js";

import {
    iniciarRegistroCliente,
    procesarRegistroCliente
} from "./flows/clienteFlow.js";

import {
    iniciarVenta,
    procesarVenta
} from "./flows/ventaFlow.js";

import {
    createTextMessage
} from "../models/MessageModel.js";

/**
 * Procesa un mensaje escrito por el usuario.
 *
 * @param {string} message
 * @returns {Object}
 */
export function chatbot(message) {

    const text = message.trim();
    const lower = text.toLowerCase();

    //--------------------------------------------------
    // Flujo activo: registro de cliente
    //--------------------------------------------------

    if (conversation.flow === "cliente") {

        return procesarRegistroCliente(text);

    }

    //--------------------------------------------------
    // Flujo activo: registro de venta
    //--------------------------------------------------

    if (conversation.flow === "venta") {

        return procesarVenta(text);

    }

    //--------------------------------------------------
    // Iniciar registro de cliente
    //--------------------------------------------------

    if (
        lower.includes("registrar cliente") ||
        lower.includes("crear cliente") ||
        lower.includes("nuevo cliente")
    ) {

        return iniciarRegistroCliente();

    }

    //--------------------------------------------------
    // Iniciar registro de venta
    //--------------------------------------------------

    if (
        lower.includes("registrar venta") ||
        lower.includes("crear venta") ||
        lower.includes("nueva venta")
    ) {

        return iniciarVenta();

    }

    //--------------------------------------------------
    // Intenciones generales
    //--------------------------------------------------

    for (const intent of intents) {

        const foundKeyword = intent.keywords.some((keyword) => {

            return lower.includes(keyword.toLowerCase());

        });

        if (foundKeyword) {

            return createTextMessage(
                "bot",
                intent.response
            );

        }

    }

    //--------------------------------------------------
    // Respuesta predeterminada
    //--------------------------------------------------

    return createTextMessage(
        "bot",
        "Lo siento, no entendí la solicitud."
    );

}