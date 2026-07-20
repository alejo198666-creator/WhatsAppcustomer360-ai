/**
 * ===========================================================
 * ventaFlow.js
 * -----------------------------------------------------------
 * Flujo conversacional para registrar ventas.
 *
 * Flujo actual:
 *
 * 1. Buscar cliente.
 * 2. Mostrar catálogo.
 * 3. Seleccionar producto.
 * 4. Solicitar cantidad.
 * 5. Agregar producto al carrito.
 * 6. Finalizar la venta.
 * ===========================================================
 */

import {
    conversation
} from "../conversationState.js";

import {
    buscarClientePorTelefono
} from "../database/clienteRepository.js";

import {
    obtenerProductos,
    buscarProducto
} from "../database/productoRepository.js";

import {
    createTextMessage,
    createCatalogMessage
} from "../../models/MessageModel.js";

import {
    isValidPhone
} from "../validators/phone.js";

/**
 * Construye el mensaje visual del catálogo.
 *
 * @param {string} notice
 * @returns {Object}
 */
function construirCatalogo(notice = "") {

    const productos = obtenerProductos();

    return createCatalogMessage({
        products: productos,
        customerName: conversation.venta.cliente?.nombre ?? "",
        notice,
        cartCount: conversation.venta.carrito.length,
        cartTotal: conversation.venta.total
    });

}

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
            conversation.step = "seleccionarProducto";

            return construirCatalogo(
                `✅ Cliente encontrado: ${cliente.nombre}`
            );

        }

        //--------------------------------------------------
        // Seleccionar producto desde el catálogo
        //--------------------------------------------------

        case "seleccionarProducto": {

            /*
             * Los botones del catálogo envían mensajes internos
             * con este formato:
             *
             * seleccionar_producto:1
             */
            if (text.startsWith("seleccionar_producto:")) {

                const productId = text.split(":")[1];

                const producto = buscarProducto(productId);

                if (!producto) {

                    return createTextMessage(
                        "bot",
                        "El producto seleccionado no existe."
                    );

                }

                conversation.venta.productoSeleccionado = producto;
                conversation.step = "cantidad";

                return createTextMessage(
                    "bot",
                    `Producto seleccionado:

${producto.nombre}

Precio unitario: $${producto.precio.toLocaleString("es-CO")}

¿Cuántas unidades deseas agregar?`
                );

            }

            //--------------------------------------------------
            // Finalizar venta desde el botón del catálogo
            //--------------------------------------------------

            if (text === "finalizar_venta") {

                if (conversation.venta.carrito.length === 0) {

                    return construirCatalogo(
                        "Debes agregar al menos un producto antes de finalizar."
                    );

                }

                const cliente = conversation.venta.cliente;
                const carrito = [...conversation.venta.carrito];
                const total = conversation.venta.total;

                const detalleProductos = carrito
                    .map((item) => {

                        return `${item.cantidad} x ${item.nombre} — $${item.subtotal.toLocaleString("es-CO")}`;

                    })
                    .join("\n");

                /*
                 * Finalizamos el flujo.
                 *
                 * En el siguiente módulo este punto creará un
                 * pedido mediante pedidoRepository.
                 */
                conversation.flow = null;
                conversation.step = null;

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
                    `✅ Venta finalizada provisionalmente

Cliente:
${cliente.nombre}

Productos:
${detalleProductos}

Total:
$${total.toLocaleString("es-CO")}

En el próximo módulo esta venta será almacenada como pedido.`
                );

            }

            return construirCatalogo(
                "Selecciona un producto utilizando uno de los botones."
            );

        }

        //--------------------------------------------------
        // Ingresar cantidad
        //--------------------------------------------------

        case "cantidad": {

            const cantidad = Number(text);

            if (
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {

                return createTextMessage(
                    "bot",
                    "La cantidad debe ser un número entero mayor que cero."
                );

            }

            const producto =
                conversation.venta.productoSeleccionado;

            if (!producto) {

                conversation.step = "seleccionarProducto";

                return construirCatalogo(
                    "No se encontró el producto seleccionado. Selecciónalo nuevamente."
                );

            }

            const subtotal = producto.precio * cantidad;

            conversation.venta.carrito.push({
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad,
                subtotal
            });

            conversation.venta.subtotal = subtotal;

            conversation.venta.total =
                conversation.venta.carrito.reduce(
                    (total, item) => total + item.subtotal,
                    0
                );

            conversation.venta.productoSeleccionado = null;
            conversation.step = "seleccionarProducto";

            return construirCatalogo(
                `✅ ${cantidad} unidad(es) de ${producto.nombre} agregada(s) al carrito.`
            );

        }

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