/**
 * ===========================================================
 * MessageModel.js
 * -----------------------------------------------------------
 * Modelo unificado de mensajes.
 *
 * Todos los mensajes del chatbot utilizan esta estructura.
 * ===========================================================
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