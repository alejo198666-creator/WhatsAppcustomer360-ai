/**
 * ===========================================================
 * chatbot.js
 * -----------------------------------------------------------
 * Orquestador principal del motor conversacional.
 *
 * Responsabilidades:
 *
 * - Detectar comandos internos.
 * - Detectar si existe un flujo activo.
 * - Delegar la entrada al flujo correspondiente.
 * - Detectar nuevos comandos conversacionales.
 * - Consultar intenciones generales.
 * - Devolver siempre un MessageModel.
 * ===========================================================
 */

import intents from "../data/intents.js";

import {
    conversation
} from "./conversationState.js";

import {
    iniciarRegistroCliente,
    procesarRegistroCliente
} from "./flows/clienteFlow.js";

import {
    iniciarVenta,
    procesarVenta
} from "./flows/ventaFlow.js";

import {
    iniciarConsultaPedido,
    procesarConsultaPedido,
    consultarPedidoPorId
} from "./flows/pedidoFlow.js";

import {
    iniciarMisPedidos,
    procesarMisPedidos
} from "./flows/misPedidosFlow.js";

import * as MessageFactory
    from "../models/MessageFactory.js";

import { mostrarMenuPrincipal } from "./menuService.js";
/**
 * Procesa un mensaje escrito o generado por la interfaz.
 *
 * @param {string} message
 * @returns {Object}
 */
export function chatbot(message) {

    const text =
        String(message ?? "").trim();

    const lower =
        text.toLowerCase();
	
	//--------------------------------------------------
    // Mostrar menú principal
    //--------------------------------------------------

    if (
        lower === "menu" ||
        lower === "menú" ||
        lower === "opciones" ||
        lower.includes("cuáles son las opciones") ||
        lower.includes("cuales son las opciones") ||
        lower.includes("menu principal") ||
        lower.includes("menú principal") ||
        lower.includes("regresar al menu") ||
        lower.includes("regresar al menú") ||
        lower.includes("volver al menu") ||
        lower.includes("volver al menú")
    ) {

        conversation.flow = null;

        return mostrarMenuPrincipal();

    }

    //--------------------------------------------------
    // Comando interno: ver detalle de un pedido
    //--------------------------------------------------

    if (
        lower.startsWith(
            "consultar_pedido:"
        )
    ) {

        const separatorPosition =
            text.indexOf(":");

        const orderId =
            text
                .slice(
                    separatorPosition + 1
                )
                .trim();

        return consultarPedidoPorId(
            orderId
        );

    }

    //--------------------------------------------------
    // Flujo activo: registro de cliente
    //--------------------------------------------------

    if (conversation.flow === "cliente") {

        return procesarRegistroCliente(text);

    }

    //--------------------------------------------------
    // Flujo activo: registro de venta
    //--------------------------------------------------

    if (conversation.flow === "venta") {

        return procesarVenta(text);

    }

    //--------------------------------------------------
    // Flujo activo: consulta de pedido
    //--------------------------------------------------

    if (conversation.flow === "pedido") {

        return procesarConsultaPedido(text);

    }

    //--------------------------------------------------
    // Flujo activo: mis pedidos
    //--------------------------------------------------

    if (conversation.flow === "misPedidos") {

        return procesarMisPedidos(text);

    }

    //--------------------------------------------------
    // Iniciar registro de cliente
    //--------------------------------------------------

    if (
        lower === "1" ||
        lower.includes("registrar cliente") ||
        lower.includes("crear cliente") ||
        lower.includes("nuevo cliente")
    ) {

        return iniciarRegistroCliente();

    }

    //--------------------------------------------------
    // Iniciar registro de venta
    //--------------------------------------------------

     if (
        lower === "2" ||
        lower.includes("crear pedido") ||
        lower.includes("registrar venta") ||
        lower.includes("crear venta") ||
        lower.includes("nueva venta")
    ) {

        return iniciarVenta();

    }

    //--------------------------------------------------
    // Iniciar consulta de todos los pedidos del cliente
    //--------------------------------------------------

    /*
     * Esta condición debe ir antes de "consultar pedido",
     * porque representa una intención diferente.
     */
    if (
        lower === "mis pedidos" ||
        lower.includes("ver mis pedidos") ||
        lower.includes("consultar mis pedidos") ||
        lower.includes("listar mis pedidos") ||
        lower.includes("historial de pedidos")
    ) {

        return iniciarMisPedidos();

    }

    //--------------------------------------------------
    // Iniciar consulta de un solo pedido
    //--------------------------------------------------

     if (
        lower === "3" ||
        lower.includes("consultar pedido") ||
        lower.includes("buscar pedido") ||
        lower.includes("ver pedido")
    ) {

        return iniciarConsultaPedido();

    }

    //--------------------------------------------------
    // Intenciones generales
    //--------------------------------------------------

    for (const intent of intents) {

        const foundKeyword =
            intent.keywords.some(
                (keyword) => {

                    return lower.includes(
                        keyword.toLowerCase()
                    );

                }
            );

        if (foundKeyword) {

            return MessageFactory.text(
                intent.response
            );

        }

    }

    //--------------------------------------------------
    // Respuesta predeterminada
    //--------------------------------------------------

        return mostrarMenuPrincipal(
        "Lo siento, no entendí la solicitud. Estas son las opciones disponibles:"
    );

}