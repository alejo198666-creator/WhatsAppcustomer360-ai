import * as MessageFactory
    from "../models/MessageFactory.js";

/**
 * Construye el menú principal del chatbot.
 *
 * Este servicio se utiliza:
 *
 * - Al iniciar la aplicación.
 * - Después de crear un cliente.
 * - Después de crear un pedido.
 * - Después de consultar un pedido.
 * - Cuando el usuario solicita regresar al menú.
 *
 * @param {string} message
 * @returns {Object}
 */
export function mostrarMenuPrincipal(
    message = "¿Qué deseas hacer?"
) {

    return MessageFactory.text(
        `${message}

1️⃣ Crear cliente
2️⃣ Crear pedido
3️⃣ Consultar pedido

Escribe el número o el nombre de la opción.`
    );

}