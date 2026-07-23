/**
 * ===========================================================
 * ventaFlow.js
 * -----------------------------------------------------------
 * Flujo conversacional para registrar ventas.
 *
 * Responsabilidades:
 *
 * - Controlar los pasos de la conversación.
 * - Buscar el cliente.
 * - Mostrar el catálogo.
 * - Recibir producto y cantidad.
 * - Solicitar los servicios de carrito y precios.
 * - Construir y guardar el pedido.
 *
 * Los cálculos y la persistencia no se realizan directamente
 * en este archivo.
 * ===========================================================
 */

import {
    conversation,
    createInitialSaleState
} from "../conversationState.js";

import {
    buscarClientePorTelefono
} from "../database/clienteRepository.js";

import {
    obtenerProductos,
    buscarProducto
} from "../database/productoRepository.js";

import {
    guardarPedido
} from "../database/pedidoRepository.js";

import {
    addProduct,
    countCartUnits,
    isCartEmpty
} from "../cart/cartService.js";

import {
    calculatePricing
} from "../pricing/pricingService.js";

import {
    buildOrder
} from "../orders/orderService.js";

import * as MessageFactory
  from "../../models/MessageFactory.js";
	
import {
    isValidPhone
} from "../validators/phone.js";

import {
    mostrarMenuPrincipal
} from "../menuService.js";
/**
 * Formatea un valor como pesos colombianos.
 *
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);

}

/**
 * Actualiza los valores monetarios de la venta utilizando
 * PricingService.
 *
 * @returns {Object}
 */
function updateSalePricing() {

    const pricing = calculatePricing(
        conversation.venta.carrito
    );

    conversation.venta.subtotal =
        pricing.subtotal;

    conversation.venta.iva =
        pricing.tax;

    conversation.venta.descuento =
        pricing.discount;

    conversation.venta.total =
        pricing.total;

    return pricing;

}

/**
 * Construye el mensaje visual del catálogo.
 *
 * @param {string} notice
 * @returns {Object}
 */
function buildCatalogMessage(notice = "") {

    const products = obtenerProductos();

    const cartUnits = countCartUnits(
        conversation.venta.carrito
    );

    return MessageFactory.catalog({
		products,
		customerName:
			conversation.venta.cliente?.nombre ?? "",
		notice,
		cartCount: cartUnits,
		cartTotal: conversation.venta.total
    });

}

/**
 * Limpia únicamente el estado del flujo de venta.
 */
function resetSaleFlow() {

    conversation.flow = null;
    conversation.step = null;
    conversation.venta = createInitialSaleState();

}

/**
 * Inicia el registro de una venta.
 *
 * @returns {Object}
 */
export function iniciarVenta() {

    conversation.flow = "venta";
    conversation.step = "buscarCliente";
    conversation.venta = createInitialSaleState();

    return MessageFactory.text(
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

    const text = String(message).trim();

    switch (conversation.step) {

        //--------------------------------------------------
        // Buscar cliente
        //--------------------------------------------------

        case "buscarCliente": {

            if (!isValidPhone(text)) {

                return MessageFactory.text(
                    "El número de WhatsApp debe contener exactamente 10 dígitos."
                );

            }

            const customer =
                buscarClientePorTelefono(text);

            if (!customer) {

                resetSaleFlow();

                return MessageFactory.text(
                    `❌ El cliente no existe.

Primero debes registrarlo.

Escribe:

Registrar cliente`
                );

            }

            conversation.venta.cliente = customer;
            conversation.step = "seleccionarProducto";

            return buildCatalogMessage(
                `✅ Cliente encontrado: ${customer.nombre}`
            );

        }

        //--------------------------------------------------
        // Seleccionar producto
        //--------------------------------------------------

        case "seleccionarProducto": {

            if (
                text.startsWith(
                    "seleccionar_producto:"
                )
            ) {

                const productId =
                    text.split(":")[1];

                const product =
                    buscarProducto(productId);

                if (!product) {

                    return MessageFactory.text(
                        "El producto seleccionado no existe."
                    );

                }

                conversation.venta.productoSeleccionado =
                    product;

                conversation.step = "cantidad";

                return MessageFactory.text(
                    `Producto seleccionado:

${product.nombre}

Precio unitario:
${formatCurrency(product.precio)}

¿Cuántas unidades deseas agregar?`
                );

            }

            //--------------------------------------------------
            // Finalizar venta y generar pedido
            //--------------------------------------------------

            if (text === "finalizar_venta") {

                if (
                    isCartEmpty(
                        conversation.venta.carrito
                    )
                ) {

                    return buildCatalogMessage(
                        "Debes agregar al menos un producto antes de finalizar."
                    );

                }

                try {

                    /*
                     * Calculamos nuevamente los precios antes
                     * de generar el pedido.
                     */
                    const pricing =
                        updateSalePricing();

                    /*
                     * OrderService construye el pedido, pero no
                     * lo almacena.
                     */
                    const order = buildOrder(
                        conversation.venta.cliente,
                        conversation.venta.carrito,
                        pricing
                    );

                    /*
                     * PedidoRepository se encarga de guardar
                     * el pedido en fakeDB.
                     */
                    const savedOrder =
                        guardarPedido(order);

                    /*
                     * Conservamos el pedido recién creado para
                     * futuras consultas o renderización.
                     */
                    conversation.pedido =
                        savedOrder;

                    conversation.venta.pedidoId =
                        savedOrder.id;



                    /*
                     * Terminamos el flujo, pero conservamos
                     * conversation.pedido.
                     */
                    conversation.flow = null;
                    conversation.step = null;
                    conversation.venta =
                        createInitialSaleState();
					/*
					 * MessageFactory genera un mensaje de tipo "order".
					 */
					return [
							MessageFactory.order(savedOrder),

							mostrarMenuPrincipal(
        "✅ Pedido creado correctamente. ¿Qué deseas hacer ahora?"
    )
];	

                    
                } catch (error) {

                    console.error(
                        "Error al generar el pedido:",
                        error
                    );

                    return MessageFactory.text(
                        `No fue posible generar el pedido.

Intenta finalizar la venta nuevamente.`
                    );

                }

            }

            return buildCatalogMessage(
                "Selecciona un producto utilizando uno de los botones."
            );

        }

        //--------------------------------------------------
        // Ingresar cantidad
        //--------------------------------------------------

        case "cantidad": {

            const quantity = Number(text);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                return MessageFactory.text(
                    "La cantidad debe ser un número entero mayor que cero."
                );

            }

            const selectedProduct =
                conversation.venta.productoSeleccionado;

            if (!selectedProduct) {

                conversation.step =
                    "seleccionarProducto";

                return buildCatalogMessage(
                    "No se encontró el producto seleccionado. Selecciónalo nuevamente."
                );

            }

            try {

                /*
                 * CartService devuelve un carrito nuevo.
                 * No modifica directamente el anterior.
                 */
                conversation.venta.carrito =
                    addProduct(
                        conversation.venta.carrito,
                        selectedProduct,
                        quantity
                    );

                /*
                 * PricingService calcula todos los valores.
                 */
                updateSalePricing();

                conversation.venta.productoSeleccionado =
                    null;

                conversation.step =
                    "seleccionarProducto";

                return buildCatalogMessage(
                    `✅ ${quantity} unidad(es) de ${selectedProduct.nombre} agregada(s) al carrito.`
                );

            } catch (error) {

                console.error(
                    "Error al agregar producto:",
                    error
                );

                return MessageFactory.text(
                    `No fue posible agregar el producto al carrito.

Intenta ingresar nuevamente la cantidad.`
                );

            }

        }

        //--------------------------------------------------
        // Estado inesperado
        //--------------------------------------------------

        default:

            resetSaleFlow();

            return MessageFactory.text(
                `Ocurrió un problema durante el registro de la venta.

Escribe "Registrar venta" para comenzar nuevamente.`
            );

    }

}