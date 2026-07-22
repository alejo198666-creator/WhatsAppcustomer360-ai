/**
 * ===========================================================
 * orderService.js
 * -----------------------------------------------------------
 * Servicio de dominio responsable de:
 *
 * - construir pedidos;
 * - definir estados permitidos;
 * - validar transiciones de estado;
 * - solicitar al repositorio la actualización persistente.
 *
 * La persistencia sigue siendo responsabilidad de:
 *
 * pedidoRepository.js
 * ===========================================================
 */

import {
    ORDER_STATUS,
    isValidOrderStatus
} from "../../constants/orderStatus.js";

import {
    generateOrderId
} from "../utils/generateOrderId.js";

import {
    buscarPedidoPorId,
    actualizarEstadoPedido
} from "../database/pedidoRepository.js";

/**
 * Mapa de transiciones permitidas entre estados.
 *
 * Cada clave representa el estado actual del pedido.
 * El arreglo asociado contiene los estados a los que
 * se permite avanzar.
 */
const ALLOWED_STATUS_TRANSITIONS = Object.freeze({
    [ORDER_STATUS.PENDING]: Object.freeze([
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.CANCELLED
    ]),

    [ORDER_STATUS.CONFIRMED]: Object.freeze([
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.CANCELLED
    ]),

    [ORDER_STATUS.PREPARING]: Object.freeze([
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.CANCELLED
    ]),

    [ORDER_STATUS.SHIPPED]: Object.freeze([
        ORDER_STATUS.DELIVERED
    ]),

    [ORDER_STATUS.DELIVERED]: Object.freeze([]),

    [ORDER_STATUS.CANCELLED]: Object.freeze([])
});

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

        estado: ORDER_STATUS.PENDING,

        fechaCreacion: new Date(),

        fechaActualizacion: null
    };

}

/**
 * Devuelve los estados disponibles para un pedido
 * según su estado actual.
 *
 * @param {string} currentStatus
 * @returns {Array<string>}
 */
export function getAllowedOrderStatuses(
    currentStatus
) {

    if (!isValidOrderStatus(currentStatus)) {

        return [];

    }

    return [
        ...ALLOWED_STATUS_TRANSITIONS[currentStatus]
    ];

}

/**
 * Indica si una transición de estado está permitida.
 *
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {boolean}
 */
export function canChangeOrderStatus(
    currentStatus,
    newStatus
) {

    return getAllowedOrderStatuses(
        currentStatus
    ).includes(newStatus);

}

/**
 * Cambia el estado de un pedido.
 *
 * Este método aplica las reglas de negocio y delega
 * la persistencia al repositorio.
 *
 * @param {string} orderId
 * @param {string} newStatus
 *
 * @returns {Object}
 *
 * @throws {TypeError}
 * @throws {Error}
 */
export function cambiarEstadoPedido(
    orderId,
    newStatus
) {

    const normalizedOrderId =
        String(orderId ?? "").trim();

    const normalizedNewStatus =
        String(newStatus ?? "").trim();

    if (!normalizedOrderId) {

        throw new TypeError(
            "El identificador del pedido es obligatorio."
        );

    }

    if (!isValidOrderStatus(normalizedNewStatus)) {

        throw new TypeError(
            `El estado "${normalizedNewStatus}" no es válido.`
        );

    }

    const order =
        buscarPedidoPorId(normalizedOrderId);

    if (!order) {

        throw new Error(
            `No se encontró el pedido ${normalizedOrderId}.`
        );

    }

    if (order.estado === normalizedNewStatus) {

        throw new Error(
            `El pedido ya se encuentra en estado ${normalizedNewStatus}.`
        );

    }

    if (
        !canChangeOrderStatus(
            order.estado,
            normalizedNewStatus
        )
    ) {

        throw new Error(
            `No se permite cambiar el pedido de "${order.estado}" a "${normalizedNewStatus}".`
        );

    }

    const updatedOrder =
        actualizarEstadoPedido(
            normalizedOrderId,
            normalizedNewStatus
        );

    if (!updatedOrder) {

        throw new Error(
            `No fue posible actualizar el pedido ${normalizedOrderId}.`
        );

    }

    return updatedOrder;

}