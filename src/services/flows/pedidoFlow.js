/**
 * ===========================================================
 * pedidoFlow.js
 * -----------------------------------------------------------
 * Flujo conversacional para consultar un pedido por su número.
 *
 * Permite:
 *
 * 1. Consulta conversacional:
 *    "Consultar pedido" → solicitar número.
 *
 * 2. Consulta directa:
 *    "consultar_pedido:PED-000003"
 * ===========================================================
 */

import {
    conversation
} from "../conversationState.js";

import {
    buscarPedidoPorId
} from "../database/pedidoRepository.js";

import * as MessageFactory
    from "../../models/MessageFactory.js";

/**
 * Reinicia el flujo de consulta de pedido.
 *
 * @param {boolean} clearOrder
 */
function resetOrderFlow(
    clearOrder = true
) {

    conversation.flow = null;
    conversation.step = null;

    if (clearOrder) {

        conversation.pedido = null;

    }

}

/**
 * Normaliza el identificador de un pedido.
 *
 * Ejemplos:
 *
 * 3           → PED-000003
 * 000003      → PED-000003
 * ped-000003  → PED-000003
 *
 * @param {string} value
 * @returns {string}
 */
function normalizeOrderId(value) {

    const text =
        String(value ?? "")
            .trim()
            .toUpperCase();

    if (/^\d{1,6}$/.test(text)) {

        return `PED-${text.padStart(6, "0")}`;

    }

    return text;

}

/**
 * Valida el formato normalizado.
 *
 * @param {string} orderId
 * @returns {boolean}
 */
function isValidOrderId(orderId) {

    return /^PED-\d{6}$/.test(orderId);

}

/**
 * Consulta y devuelve un pedido visual.
 *
 * Esta función se reutiliza desde el flujo conversacional
 * y desde el botón "Ver detalle".
 *
 * @param {string} value
 * @returns {Object}
 */
export function consultarPedidoPorId(value) {

    const orderId =
        normalizeOrderId(value);

    if (!isValidOrderId(orderId)) {

        return MessageFactory.text(
            `El número del pedido no tiene un formato válido.

Escribe un número como:

PED-000003`
        );

    }

    const order =
        buscarPedidoPorId(orderId);

    if (!order) {

        return MessageFactory.text(
            `❌ No se encontró el pedido ${orderId}.

Verifica el número e intenta nuevamente.`
        );

    }

    conversation.pedido = order;

    /*
     * Conservamos conversation.pedido, pero cerramos
     * cualquier flujo activo.
     */
    resetOrderFlow(false);

    return MessageFactory.order(order);

}

/**
 * Inicia la consulta conversacional.
 *
 * @returns {Object}
 */
export function iniciarConsultaPedido() {

    conversation.flow = "pedido";
    conversation.step = "numeroPedido";
    conversation.pedido = null;

    return MessageFactory.text(
        `🧾 Consultar pedido

Escribe el número del pedido.

Ejemplo:

PED-000003`
    );

}

/**
 * Procesa el número escrito durante el flujo.
 *
 * @param {string} message
 * @returns {Object}
 */
export function procesarConsultaPedido(message) {

    switch (conversation.step) {

        case "numeroPedido":

            return consultarPedidoPorId(
                message
            );

        default:

            resetOrderFlow();

            return MessageFactory.text(
                `Ocurrió un problema durante la consulta.

Escribe "Consultar pedido" para comenzar nuevamente.`
            );

    }

}