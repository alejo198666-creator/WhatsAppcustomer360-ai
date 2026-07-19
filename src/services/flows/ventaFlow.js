/**
 * ======================================================
 * ventaFlow.js
 * ------------------------------------------------------
 * Flujo de registro de ventas.
 *
 * Iteración 1
 * - Buscar cliente
 * - Validar existencia
 * ======================================================
 */

import { conversation } from "../conversationState";
import { buscarClientePorTelefono } from "../database/clienteRepository";

/**
 * Inicia el flujo de ventas.
 */
export function iniciarVenta(){

    conversation.flow = "venta";

    conversation.step = "buscarCliente";

    conversation.venta = {

        cliente:null,

        productos:[],

        total:0,

        pedidoId:null

    };

    return `🛒 Registro de venta

Ingrese el número de WhatsApp del cliente.`;

}

/**
 * Continúa el flujo de ventas.
 */
export function procesarVenta(message){

    switch(conversation.step){

        //--------------------------------------------------
        // Buscar cliente
        //--------------------------------------------------

        case "buscarCliente":

            const cliente =
                buscarClientePorTelefono(message);

            if(!cliente){

                conversation.flow=null;

                conversation.step=null;

                return `❌ El cliente no existe.

Primero debes registrarlo.

Escribe:

Registrar cliente`;

            }

            conversation.venta.cliente=cliente;

            conversation.step="catalogo";

            return `✅ Cliente encontrado

Nombre:
${cliente.nombre}

Ahora mostraremos el catálogo de productos...`;

    }

}