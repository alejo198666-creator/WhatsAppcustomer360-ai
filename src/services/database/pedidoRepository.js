/**
 * ===========================================================
 * pedidoRepository.js
 * -----------------------------------------------------------
 * Repositorio temporal de pedidos.
 *
 * Actualmente utiliza fakeDB.
 *
 * En el futuro realizará solicitudes HTTP hacia FastAPI.
 * ===========================================================
 */

import {
    pedidos
} from "../../data/fakeDB.js";

/**
 * Crea una copia segura de un pedido.
 *
 * @param {Object} order
 * @returns {Object}
 */
function cloneOrder(order) {

    return {
        ...order,

        cliente: {
            ...order.cliente
        },

        productos: order.productos.map(
            (item) => ({
                ...item
            })
        )
    };

}

/**
 * Guarda un pedido.
 *
 * @param {Object} order
 * @returns {Object}
 */
export function guardarPedido(order) {

    if (!order?.id) {

        throw new TypeError(
            "No se puede guardar un pedido inválido."
        );

    }

    if (!Array.isArray(order.productos)) {

        throw new TypeError(
            "El pedido debe contener un arreglo de productos."
        );

    }

    const orderCopy = cloneOrder(order);

    pedidos.push(orderCopy);

    return cloneOrder(orderCopy);

}

/**
 * Busca un pedido por su identificador.
 *
 * @param {string} orderId
 * @returns {Object|null}
 */
export function buscarPedidoPorId(orderId) {

    const normalizedOrderId =
        String(orderId).trim().toLowerCase();

    const order = pedidos.find(
        (item) =>
            item.id.toLowerCase() === normalizedOrderId
    );

    if (!order) {

        return null;

    }

    return cloneOrder(order);

}

/**
 * Devuelve todos los pedidos.
 *
 * @returns {Array}
 */
export function obtenerPedidos() {

    return pedidos.map(
        (order) => cloneOrder(order)
    );

}

/**
 * Busca pedidos por teléfono del cliente.
 *
 * @param {string} phone
 * @returns {Array}
 */
export function buscarPedidosPorTelefono(phone) {

    const normalizedPhone =
        String(phone).trim();

    return pedidos
        .filter(
            (order) =>
                order.cliente?.telefono === normalizedPhone
        )
        .map(
            (order) => cloneOrder(order)
        );

}

/**
 * Elimina los pedidos almacenados.
 *
 * Se utiliza principalmente en pruebas automatizadas.
 */
export function limpiarPedidos() {

    pedidos.splice(0, pedidos.length);

}