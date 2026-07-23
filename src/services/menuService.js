import * as MessageFactory
    from "../models/MessageFactory.js";

/**
 * Devuelve el menú principal del chatbot.
 *
 * @param {string} message
 * @returns {Object}
 */
export function mostrarMenuPrincipal(
    message = "¿Qué deseas hacer ahora?"
) {

    return MessageFactory.text(
        `${message}

1️⃣ Crear cliente
2️⃣ Crear pedido
3️⃣ Consultar pedido

También puedes escribir el nombre de la opción.`
    );

}