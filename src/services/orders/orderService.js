/**
 * ===========================================================
 * orderService.js
 * -----------------------------------------------------------
 * Servicio de dominio responsable de construir pedidos.
 *
 * No guarda el pedido.
 *
 * La persistencia será responsabilidad de:
 *
 * pedidoRepository.js
 * ===========================================================
 */

import {
    generateOrderId
} from "../utils/generateOrderId.js";

/**
 * Valida los datos necesarios para crear un pedido.
 *
 * @param {Object} customer
 * @param {Array} cart
 * @param {Object} pricing
 */
function validateOrderData(
    customer,
    cart,
    pricing
) {

    if (!customer) {

        throw new TypeError(
            "El pedido debe tener un cliente."
        );

    }

    if (!Array.isArray(cart) || cart.length === 0) {

        throw new Error(
            "No se puede crear un pedido con el carrito vacío."
        );

    }

    if (
        !pricing ||
        !Number.isFinite(pricing.subtotal) ||
        !Number.isFinite(pricing.tax) ||
        !Number.isFinite(pricing.discount) ||
        !Number.isFinite(pricing.total)
    ) {

        throw new TypeError(
            "La información de precios no es válida."
        );

    }

}

/**
 * Construye un nuevo pedido.
 *
 * Se crean copias del cliente y los productos para evitar
 * modificaciones accidentales posteriores.
 *
 * @param {Object} customer
 * @param {Array} cart
 * @param {Object} pricing
 *
 * @returns {Object}
 */
export function buildOrder(
    customer,
    cart,
    pricing
) {

    validateOrderData(
        customer,
        cart,
        pricing
    );

    return {
        id: generateOrderId(),

        cliente: {
            ...customer
        },

        productos: cart.map((item) => ({
            ...item
        })),

        subtotal: pricing.subtotal,

        iva: pricing.tax,

        descuento: pricing.discount,

        total: pricing.total,

        estado: "Pendiente",

        fechaCreacion: new Date(),

        fechaActualizacion: null
    };

}