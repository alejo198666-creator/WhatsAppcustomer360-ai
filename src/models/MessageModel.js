/**
 * ===========================================================
 * MessageModel.js
 * -----------------------------------------------------------
 * Modelo unificado de mensajes del sistema.
 *
 * Todos los mensajes del usuario y del bot utilizan esta
 * estructura común.
 * ===========================================================
 */

/**
 * Crea un mensaje genérico.
 *
 * @param {Object} options
 * @param {"user"|"bot"|"system"} options.sender
 * @param {string} options.type
 * @param {Object} options.payload
 *
 * @returns {Object}
 */
export function createMessage({
    sender,
    type = "text",
    payload = {}
}) {

    return {
        id: crypto.randomUUID(),
        sender,
        type,
        payload,
        createdAt: new Date()
    };

}

/**
 * Crea un mensaje de texto.
 *
 * @param {"user"|"bot"|"system"} sender
 * @param {string} text
 *
 * @returns {Object}
 */
export function createTextMessage(sender, text) {

    return createMessage({
        sender,
        type: "text",
        payload: {
            text
        }
    });

}

/**
 * Crea un mensaje de catálogo.
 *
 * @param {Object} options
 * @param {Array} options.products
 * @param {string} options.customerName
 * @param {string} options.notice
 * @param {number} options.cartCount
 * @param {number} options.cartTotal
 *
 * @returns {Object}
 */
export function createCatalogMessage({
    products = [],
    customerName = "",
    notice = "",
    cartCount = 0,
    cartTotal = 0
}) {

    return createMessage({
        sender: "bot",
        type: "catalog",
        payload: {
            title: "🛒 Catálogo de productos",
            customerName,
            notice,
            products,
            cartCount,
            cartTotal
        }
    });

}