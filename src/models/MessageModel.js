/**
 * ===========================================================
 * MessageModel.js
 * -----------------------------------------------------------
 * Modelo unificado de mensajes del sistema.
 *
 * Todos los mensajes utilizan una estructura común:
 *
 * {
 *     id,
 *     sender,
 *     type,
 *     payload,
 *     createdAt,
 *     updatedAt
 * }
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
        createdAt: new Date(),
        updatedAt: null
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
 * Crea un mensaje de catálogo visual.
 *
 * @param {Object} options
 * @param {Array} options.products
 * @param {string} options.customerName
 * @param {string} options.notice
 * @param {number} options.cartCount
 * @param {number} options.cartTotal
 * @param {boolean} options.isInteractive
 *
 * @returns {Object}
 */
export function createCatalogMessage({
    products = [],
    customerName = "",
    notice = "",
    cartCount = 0,
    cartTotal = 0,
    isInteractive = true
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
            cartTotal,

            /*
             * Permite desactivar los botones una vez realizada
             * una acción sobre este catálogo.
             */
            isInteractive
        }
    });

}