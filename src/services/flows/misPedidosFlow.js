/**
 * ===========================================================
 * misPedidosFlow.js
 * -----------------------------------------------------------
 * Flujo conversacional para consultar todos los pedidos
 * asociados al número de WhatsApp de un cliente.
 *
 * Responsabilidades:
 *
 * - Solicitar el teléfono del cliente.
 * - Validar el número.
 * - Comprobar que el cliente exista.
 * - Consultar sus pedidos.
 * - Devolver una lista visual interactiva.
 * ===========================================================
 */

import {
    conversation
} from "../conversationState.js";

import {
    buscarClientePorTelefono
} from "../database/clienteRepository.js";

import {
    buscarPedidosPorTelefono
} from "../database/pedidoRepository.js";

import {
    isValidPhone
} from "../validators/phone.js";

import * as MessageFactory
    from "../../models/MessageFactory.js";

/**
 * Reinicia el flujo de consulta de pedidos del cliente.
 */
function resetMyOrdersFlow() {

    conversation.flow = null;
    conversation.step = null;

}

/**
 * Ordena los pedidos del más reciente al más antiguo.
 *
 * @param {Array} orders
 * @returns {Array}
 */
function sortOrdersByNewest(orders) {

    return [...orders].sort(
        (firstOrder, secondOrder) => {

            const firstDate =
                new Date(
                    firstOrder.fechaCreacion
                ).getTime();

            const secondDate =
                new Date(
                    secondOrder.fechaCreacion
                ).getTime();

            /*
             * Si alguna fecha no es válida, conservamos
             * un orden estable utilizando cero.
             */
            const safeFirstDate =
                Number.isFinite(firstDate)
                    ? firstDate
                    : 0;

            const safeSecondDate =
                Number.isFinite(secondDate)
                    ? secondDate
                    : 0;

            return safeSecondDate - safeFirstDate;

        }
    );

}

/**
 * Inicia el flujo "Mis pedidos".
 *
 * @returns {Object}
 */
export function iniciarMisPedidos() {

    conversation.flow = "misPedidos";
    conversation.step = "telefono";

    return MessageFactory.text(
        `📦 Mis pedidos

Escribe el número de WhatsApp utilizado para realizar las compras.`
    );

}

/**
 * Procesa el flujo de consulta por teléfono.
 *
 * @param {string} message
 * @returns {Object}
 */
export function procesarMisPedidos(message) {

    const text =
        String(message ?? "").trim();

    switch (conversation.step) {

        //--------------------------------------------------
        // Consultar por teléfono
        //--------------------------------------------------

        case "telefono": {

            if (!isValidPhone(text)) {

                return MessageFactory.text(
                    "El número de WhatsApp debe contener exactamente 10 dígitos."
                );

            }

            const customer =
                buscarClientePorTelefono(text);

            if (!customer) {

                resetMyOrdersFlow();

                return MessageFactory.text(
                    `❌ No existe un cliente registrado con el número ${text}.

Primero debes registrar el cliente.`
                );

            }

            const customerOrders =
                buscarPedidosPorTelefono(text);

            if (customerOrders.length === 0) {

                resetMyOrdersFlow();

                return MessageFactory.text(
                    `📦 ${customer.nombre} todavía no tiene pedidos registrados.`
                );

            }

            const sortedOrders =
                sortOrdersByNewest(
                    customerOrders
                );

            /*
             * Finalizamos el flujo antes de devolver la lista.
             */
            resetMyOrdersFlow();

            return MessageFactory.orders({
                customer,
                orders: sortedOrders,
                title: "📦 Mis pedidos"
            });

        }

        //--------------------------------------------------
        // Estado inesperado
        //--------------------------------------------------

        default:

            resetMyOrdersFlow();

            return MessageFactory.text(
                `Ocurrió un problema durante la consulta.

Escribe "Mis pedidos" para comenzar nuevamente.`
            );

    }

}