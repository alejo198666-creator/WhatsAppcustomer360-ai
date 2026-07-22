/**
 * ===========================================================
 * pedidoRepository.js
 * -----------------------------------------------------------
 * Repositorio de pedidos.
 *
 * Actualmente utiliza fakeDB como almacenamiento en memoria
 * y storageService para persistir los pedidos en localStorage.
 *
 * Responsabilidades:
 *
 * - guardar pedidos;
 * - buscar pedidos;
 * - listar pedidos;
 * - actualizar el estado de un pedido;
 * - persistir los cambios.
 *
 * El repositorio no contiene reglas de negocio sobre qué
 * cambios de estado están permitidos.
 * ===========================================================
 */

import {
    pedidos
} from "../../data/fakeDB.js";

import {
    savePedidos,
    clearPedidosStorage
} from "../storage/storageService.js";

/**
 * Crea una copia segura de un pedido.
 *
 * Esto evita que otros módulos modifiquen directamente
 * los objetos almacenados dentro de fakeDB.
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

        productos: Array.isArray(order.productos)
            ? order.productos.map(
                (item) => ({
                    ...item
                })
            )
            : []
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

    const existingOrder =
        buscarPedidoPorId(order.id);

    if (existingOrder) {

        throw new Error(
            `Ya existe un pedido con el identificador ${order.id}.`
        );

    }

    const orderCopy =
        cloneOrder(order);

    pedidos.push(orderCopy);

    /*
     * Cada vez que se agrega un pedido se actualiza
     * inmediatamente localStorage.
     */
    savePedidos(pedidos);

    return cloneOrder(orderCopy);

}

/**
 * Busca un pedido por su identificador.
 *
 * La búsqueda no distingue entre mayúsculas y minúsculas.
 *
 * @param {string} orderId
 * @returns {Object|null}
 */
export function buscarPedidoPorId(orderId) {

    const normalizedOrderId =
        String(orderId ?? "")
            .trim()
            .toLowerCase();

    const order = pedidos.find(
        (item) =>
            String(item.id)
                .toLowerCase() ===
            normalizedOrderId
    );

    if (!order) {

        return null;

    }

    return cloneOrder(order);

}

/**
 * Actualiza el estado de un pedido existente.
 *
 * Este método únicamente realiza la actualización y
 * la persistencia.
 *
 * Las reglas sobre qué cambios de estado están permitidos
 * pertenecen a OrderService.
 *
 * @param {string} orderId
 * @param {string} newStatus
 *
 * @returns {Object|null}
 */
export function actualizarEstadoPedido(
    orderId,
    newStatus
) {

    const normalizedOrderId =
        String(orderId ?? "")
            .trim()
            .toLowerCase();

    const orderIndex = pedidos.findIndex(
        (item) =>
            String(item.id)
                .toLowerCase() ===
            normalizedOrderId
    );

    /*
     * Si el pedido no existe, el repositorio devuelve null.
     * El servicio decidirá cómo informar este resultado.
     */
    if (orderIndex === -1) {

        return null;

    }

    const currentOrder =
        pedidos[orderIndex];

    const updatedOrder = {
        ...currentOrder,

        estado: newStatus,

        fechaActualizacion:
            new Date()
    };

    /*
     * Reemplazamos el pedido dentro del arreglo compartido.
     */
    pedidos[orderIndex] =
        updatedOrder;

    /*
     * Persistimos inmediatamente la colección completa.
     */
    savePedidos(pedidos);

    return cloneOrder(updatedOrder);

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
        String(phone ?? "").trim();

    return pedidos
        .filter(
            (order) =>
                order.cliente?.telefono ===
                normalizedPhone
        )
        .map(
            (order) => cloneOrder(order)
        );

}

/**
 * Elimina los pedidos almacenados.
 *
 * Se utiliza principalmente durante pruebas automatizadas.
 */
export function limpiarPedidos() {

    pedidos.splice(
        0,
        pedidos.length
    );

    clearPedidosStorage();

}	