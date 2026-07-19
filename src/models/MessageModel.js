/**
 * ===========================================================
 * MessageModel.js
 * -----------------------------------------------------------
 * Modelo unificado de mensajes del sistema.
 *
 * Todos los mensajes del usuario y del bot deben utilizar
 * esta estructura para que la interfaz pueda renderizarlos
 * según su tipo.
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
 * Crea específicamente un mensaje de texto.
 *
 * Esta función evita repetir constantemente:
 *
 * {
 *   sender,
 *   type: "text",
 *   payload: { text }
 * }
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