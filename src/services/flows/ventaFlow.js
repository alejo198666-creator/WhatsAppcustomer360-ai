/**
 * ===========================================================
 * ventaFlow.js
 * -----------------------------------------------------------
 * Flujo conversacional para registrar ventas.
 *
 * Iteración actual:
 *
 * - Solicitar teléfono.
 * - Buscar cliente.
 * - Validar si existe.
 * - Preparar el paso del catálogo.
 * ===========================================================
 */

import {
    conversation
} from "../conversationState";

import {
    buscarClientePorTelefono
} from "../database/clienteRepository";

import {
    createTextMessage
} from "../../models/MessageModel";

import {
    isValidPhone
} from "../validators/phone";

/**
 * Inicia el flujo de registro de ventas.
 *
 * @returns {Object}
 */
export function iniciarVenta() {

    conversation.flow = "venta";
    conversation.step = "buscarCliente";

    conversation.venta = {
        cliente: null,
        carrito: [],
        productoSeleccionado: null,
        subtotal: 0,
        total: 0,
        pedidoId: null
    };

    return createTextMessage(
        "bot",
        `🛒 Registro de venta

Ingrese el número de WhatsApp del cliente.`
    );

}

/**
 * Continúa el flujo de registro de venta.
 *
 * @param {string} message
 * @returns {Object}
 */
export function procesarVenta(message) {

    const text = message.trim();

    switch (conversation.step) {

        //--------------------------------------------------
        // Buscar cliente
        //--------------------------------------------------

        case "buscarCliente": {

            if (!isValidPhone(text)) {

                return createTextMessage(
                    "bot",
                    "El número de WhatsApp debe contener exactamente 10 dígitos."
                );

            }

            const cliente = buscarClientePorTelefono(text);

            if (!cliente) {

                conversation.flow = null;
                conversation.step = null;

                return createTextMessage(
                    "bot",
                    `❌ El cliente no existe.

Primero debes registrarlo.

Escribe:

Registrar cliente`
                );

            }

            conversation.venta.cliente = cliente;
            conversation.step = "catalogo";

            return createTextMessage(
                "bot",
                `✅ Cliente encontrado

Nombre:
${cliente.nombre}

Ahora mostraremos el catálogo de productos...`
            );

        }

        //--------------------------------------------------
        // Paso que implementaremos en el próximo módulo
        //--------------------------------------------------

        case "catalogo":

            return createTextMessage(
                "bot",
                "El catálogo visual estará disponible en el siguiente módulo."
            );

        //--------------------------------------------------
        // Estado inesperado
        //--------------------------------------------------

        default:

            conversation.flow = null;
            conversation.step = null;

            return createTextMessage(
                "bot",
                `Ocurrió un problema durante el registro de la venta.

Escribe "Registrar venta" para comenzar nuevamente.`
            );

    }

}