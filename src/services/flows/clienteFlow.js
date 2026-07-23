/**
 * ===========================================================
 * clienteFlow.js
 * -----------------------------------------------------------
 * Controla el flujo conversacional para registrar clientes.
 *
 * Pasos:
 *
 * 1. Nombre
 * 2. Teléfono
 * 3. Correo
 * 4. Dirección
 * 5. Guardar cliente
 * ===========================================================
 */

import { conversation } from "../conversationState.js";

import {
    createTextMessage
} from "../../models/MessageModel.js";

import {
    isValidPhone
} from "../validators/phone.js";

import {
    isValidEmail
} from "../validators/email.js";

import {
    guardarCliente,
    getClientes
} from "../database/clienteRepository.js";
import {
    mostrarMenuPrincipal
} from "../menuService.js";
/**
 * Inicia el registro de un nuevo cliente.
 *
 * @returns {Object}
 */
export function iniciarRegistroCliente() {

    conversation.flow = "cliente";
    conversation.step = "nombre";
    conversation.cliente = {};

    return createTextMessage(
        "bot",
        `Perfecto 👍

Vamos a registrar un nuevo cliente.

👤 ¿Cuál es el nombre completo?`
    );

}

/**
 * Procesa cada paso del registro de cliente.
 *
 * @param {string} message
 * @returns {Object}
 */
export function procesarRegistroCliente(message) {

    const text = message.trim();
	


    switch (conversation.step) {

        //--------------------------------------------------
        // Nombre
        //--------------------------------------------------

        case "nombre":

            conversation.cliente.nombre = text;
            conversation.step = "telefono";

            return createTextMessage(
                "bot",
                "📱 ¿Cuál es el número de WhatsApp del cliente?"
            );

        //--------------------------------------------------
        // Teléfono
        //--------------------------------------------------

        case "telefono":

            if (!isValidPhone(text)) {

                return createTextMessage(
                    "bot",
                    "El número debe contener exactamente 10 dígitos."
                );

            }

            conversation.cliente.telefono = text;
            conversation.step = "correo";

            return createTextMessage(
                "bot",
                "📧 ¿Cuál es el correo electrónico?"
            );

        //--------------------------------------------------
        // Correo
        //--------------------------------------------------

        case "correo":

            if (!isValidEmail(text)) {

                return createTextMessage(
                    "bot",
                    "Ingresa un correo electrónico válido."
                );

            }

            conversation.cliente.correo = text;
            conversation.step = "direccion";

            return createTextMessage(
                "bot",
                "🏠 ¿Cuál es la dirección del cliente?"
            );

        //--------------------------------------------------
        // Dirección y almacenamiento
        //--------------------------------------------------

        case "direccion": {

    conversation.cliente.direccion = text;

    try {

        guardarCliente({
            ...conversation.cliente
        });

        const totalClientes =
            getClientes().length;

        /*
         * Restablecemos el flujo después de guardar
         * correctamente el cliente.
         */
        conversation.flow = null;
        conversation.step = null;
        conversation.cliente = {};

        return [
            createTextMessage(
                "bot",
                `✅ Cliente registrado correctamente.

Actualmente existen ${totalClientes} cliente(s) registrados.`
            ),

            mostrarMenuPrincipal()
        ];

    } catch (error) {

        /*
         * El número ya está registrado.
         *
         * Se reinicia el flujo para evitar que el usuario
         * quede atrapado en el paso de dirección.
         */
        conversation.flow = null;
        conversation.step = null;
        conversation.cliente = {};

        return [
            createTextMessage(
                "bot",
                `⚠️ ${error.message}`
            ),

            mostrarMenuPrincipal(
                "Puedes elegir otra opción o intentar registrar un cliente con un número diferente."
            )
        ];

    }

}

        //--------------------------------------------------
        // Estado inesperado
        //--------------------------------------------------

        default:

            conversation.flow = null;
            conversation.step = null;
            conversation.cliente = {};

            return createTextMessage(
                "bot",
                `Ocurrió un problema con el registro del cliente.

Escribe "Registrar cliente" para comenzar nuevamente.`
            );

    }

}