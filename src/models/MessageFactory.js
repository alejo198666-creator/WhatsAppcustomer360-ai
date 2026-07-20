/**
 * ==========================================================
 * MessageFactory.js
 * ----------------------------------------------------------
 * Fachada para la creación de mensajes del sistema.
 *
 * Los flujos NO deberían conocer el modelo interno de los
 * mensajes. Solamente solicitan el tipo de mensaje requerido.
 * ==========================================================
 */

import {
    createTextMessage,
    createCatalogMessage,
    createMessage
} from "./MessageModel.js";

/**
 * Mensaje de texto.
 */
export function text(text, sender = "bot") {
    return createTextMessage(sender, text);
}

/**
 * Catálogo interactivo.
 */
export function catalog(options) {
    return createCatalogMessage(options);
}

/**
 * Pedido visual.
 *
 * (Renderer se implementará en el siguiente sprint.)
 */
export function order(order) {

    return createMessage({
        sender: "bot",
        type: "order",
        payload: order
    });

}

/**
 * Mensaje de error.
 */
export function error(message) {

    return createTextMessage(
        "bot",
        `❌ ${message}`
    );

}

/**
 * Mensaje de éxito.
 */
export function success(message) {

    return createTextMessage(
        "bot",
        `✅ ${message}`
    );

}

/**
 * Información.
 */
export function info(message) {

    return createTextMessage(
        "bot",
        `ℹ️ ${message}`
    );

}