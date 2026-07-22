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
 *
 * @param {string} message
 * @param {string} sender
 * @returns {Object}
 */
export function text(message, sender = "bot") {

    return createTextMessage(
        sender,
        message
    );

}

/**
 * Catálogo interactivo.
 *
 * @param {Object} options
 * @returns {Object}
 */
export function catalog(options) {

    return createCatalogMessage(options);

}

/**
 * Pedido visual individual.
 *
 * @param {Object} order
 * @returns {Object}
 */
export function order(order) {

    return createMessage({
        sender: "bot",
        type: "order",
        payload: order
    });

}

/**
 * Lista visual de pedidos.
 *
 * @param {Object} options
 * @param {Object} options.customer
 * @param {Array} options.orders
 * @param {string} options.title
 * @returns {Object}
 */
export function orders({
    customer = null,
    orders: orderList = [],
    title = "📦 Mis pedidos"
} = {}) {

    return createMessage({
        sender: "bot",
        type: "orders",

        payload: {
            title,

            customer: customer
                ? {
                    ...customer
                }
                : null,

            orders: Array.isArray(orderList)
                ? orderList.map((item) => ({
                    ...item,

                    cliente: item.cliente
                        ? {
                            ...item.cliente
                        }
                        : null,

                    productos: Array.isArray(item.productos)
                        ? item.productos.map((product) => ({
                            ...product
                        }))
                        : []
                }))
                : [],

            /*
             * Permite deshabilitar los botones después de usar
             * un mensaje antiguo del historial.
             */
            isInteractive: true
        }
    });

}

/**
 * Mensaje de error.
 *
 * @param {string} message
 * @returns {Object}
 */
export function error(message) {

    return createTextMessage(
        "bot",
        `❌ ${message}`
    );

}

/**
 * Mensaje de éxito.
 *
 * @param {string} message
 * @returns {Object}
 */
export function success(message) {

    return createTextMessage(
        "bot",
        `✅ ${message}`
    );

}

/**
 * Información.
 *
 * @param {string} message
 * @returns {Object}
 */
export function info(message) {

    return createTextMessage(
        "bot",
        `ℹ️ ${message}`
    );

}