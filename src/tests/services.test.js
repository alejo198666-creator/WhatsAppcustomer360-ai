/**
 * ===========================================================
 * services.test.js
 * -----------------------------------------------------------
 * Pruebas automatizadas de los servicios de dominio.
 *
 * Se utiliza node:test, incluido directamente en Node.js.
 * ===========================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    countCartUnits,
    isCartEmpty
} from "../services/cart/cartService.js";

import {
    calculateSubtotal,
    calculatePricing
} from "../services/pricing/pricingService.js";

import {
    buildOrder,
    getAllowedOrderStatuses,
    canChangeOrderStatus,
    cambiarEstadoPedido
} from "../services/orders/orderService.js";

import {
    ORDER_STATUS
} from "../constants/orderStatus.js";

import {
    resetOrderSequence
} from "../services/utils/generateOrderId.js";

import {
    guardarPedido,
    buscarPedidoPorId,
    obtenerPedidos,
    limpiarPedidos
} from "../services/database/pedidoRepository.js";

/**
 * Productos utilizados durante las pruebas.
 */
const rice = {
    id: 1,
    nombre: "Arroz 500 g",
    precio: 4200
};

const oil = {
    id: 2,
    nombre: "Aceite 1 L",
    precio: 13800
};

/**
 * Crea y guarda un pedido básico para las pruebas
 * relacionadas con estados.
 *
 * @returns {Object}
 */
function createStoredOrder() {

    limpiarPedidos();
    resetOrderSequence();

    const customer = {
        nombre: "Javier Segura",
        telefono: "3001234567"
    };

    const cart = addProduct(
        [],
        rice,
        2
    );

    const pricing =
        calculatePricing(cart);

    const order = buildOrder(
        customer,
        cart,
        pricing
    );

    return guardarPedido(order);

}

test(
    "addProduct agrega un producto sin modificar el carrito original",
    () => {

        const originalCart = [];

        const newCart = addProduct(
            originalCart,
            rice,
            2
        );

        assert.equal(originalCart.length, 0);
        assert.equal(newCart.length, 1);
        assert.equal(newCart[0].cantidad, 2);
        assert.equal(newCart[0].subtotal, 8400);

    }
);

test(
    "addProduct acumula cantidades del mismo producto",
    () => {

        const firstCart = addProduct(
            [],
            rice,
            2
        );

        const secondCart = addProduct(
            firstCart,
            rice,
            3
        );

        assert.equal(secondCart.length, 1);
        assert.equal(secondCart[0].cantidad, 5);
        assert.equal(secondCart[0].subtotal, 21000);

        /*
         * El carrito anterior no debe modificarse.
         */
        assert.equal(firstCart[0].cantidad, 2);

    }
);

test(
    "updateQuantity modifica cantidad y subtotal",
    () => {

        const cart = addProduct(
            [],
            oil,
            1
        );

        const updatedCart = updateQuantity(
            cart,
            oil.id,
            3
        );

        assert.equal(
            updatedCart[0].cantidad,
            3
        );

        assert.equal(
            updatedCart[0].subtotal,
            41400
        );

    }
);

test(
    "removeProduct elimina el producto indicado",
    () => {

        let cart = addProduct(
            [],
            rice,
            1
        );

        cart = addProduct(
            cart,
            oil,
            1
        );

        const result = removeProduct(
            cart,
            rice.id
        );

        assert.equal(result.length, 1);

        assert.equal(
            result[0].productoId,
            oil.id
        );

    }
);

test(
    "countCartUnits suma todas las unidades",
    () => {

        let cart = addProduct(
            [],
            rice,
            2
        );

        cart = addProduct(
            cart,
            oil,
            3
        );

        assert.equal(
            countCartUnits(cart),
            5
        );

    }
);

test(
    "clearCart devuelve un carrito vacío",
    () => {

        const result = clearCart();

        assert.deepEqual(result, []);
        assert.equal(isCartEmpty(result), true);

    }
);

test(
    "calculateSubtotal suma los subtotales",
    () => {

        let cart = addProduct(
            [],
            rice,
            2
        );

        cart = addProduct(
            cart,
            oil,
            1
        );

        assert.equal(
            calculateSubtotal(cart),
            22200
        );

    }
);

test(
    "calculatePricing devuelve los valores correctos",
    () => {

        let cart = addProduct(
            [],
            rice,
            2
        );

        cart = addProduct(
            cart,
            oil,
            1
        );

        const pricing =
            calculatePricing(cart);

        assert.deepEqual(
            pricing,
            {
                subtotal: 22200,
                tax: 0,
                discount: 0,
                total: 22200
            }
        );

    }
);

test(
    "buildOrder crea un pedido con identificador consecutivo",
    () => {

        resetOrderSequence();

        const customer = {
            nombre: "Javier Segura",
            telefono: "3001234567"
        };

        const cart = addProduct(
            [],
            rice,
            2
        );

        const pricing =
            calculatePricing(cart);

        const order = buildOrder(
            customer,
            cart,
            pricing
        );

        assert.equal(
            order.id,
            "PED-000001"
        );

        assert.equal(
            order.estado,
            ORDER_STATUS.PENDING
        );

        assert.equal(
            order.total,
            8400
        );

        assert.equal(
            order.productos.length,
            1
        );

    }
);

test(
    "pedidoRepository guarda y consulta pedidos",
    () => {

        limpiarPedidos();
        resetOrderSequence();

        const customer = {
            nombre: "Javier Segura",
            telefono: "3001234567"
        };

        const cart = addProduct(
            [],
            oil,
            1
        );

        const order = buildOrder(
            customer,
            cart,
            calculatePricing(cart)
        );

        guardarPedido(order);

        const foundOrder =
            buscarPedidoPorId("PED-000001");

        assert.ok(foundOrder);

        assert.equal(
            foundOrder.cliente.nombre,
            "Javier Segura"
        );

        assert.equal(
            foundOrder.total,
            13800
        );

        assert.equal(
            obtenerPedidos().length,
            1
        );

    }
);

test(
    "getAllowedOrderStatuses devuelve únicamente transiciones válidas",
    () => {

        assert.deepEqual(
            getAllowedOrderStatuses(
                ORDER_STATUS.PENDING
            ),
            [
                ORDER_STATUS.CONFIRMED,
                ORDER_STATUS.CANCELLED
            ]
        );

        assert.deepEqual(
            getAllowedOrderStatuses(
                ORDER_STATUS.SHIPPED
            ),
            [
                ORDER_STATUS.DELIVERED
            ]
        );

        assert.deepEqual(
            getAllowedOrderStatuses(
                ORDER_STATUS.DELIVERED
            ),
            []
        );

        assert.deepEqual(
            getAllowedOrderStatuses(
                "Estado inexistente"
            ),
            []
        );

    }
);

test(
    "canChangeOrderStatus identifica transiciones permitidas y rechazadas",
    () => {

        assert.equal(
            canChangeOrderStatus(
                ORDER_STATUS.PENDING,
                ORDER_STATUS.CONFIRMED
            ),
            true
        );

        assert.equal(
            canChangeOrderStatus(
                ORDER_STATUS.PENDING,
                ORDER_STATUS.DELIVERED
            ),
            false
        );

        assert.equal(
            canChangeOrderStatus(
                ORDER_STATUS.CANCELLED,
                ORDER_STATUS.CONFIRMED
            ),
            false
        );

    }
);

test(
    "cambiarEstadoPedido actualiza y persiste un estado válido",
    () => {

        const order =
            createStoredOrder();

        const updatedOrder =
            cambiarEstadoPedido(
                order.id,
                ORDER_STATUS.CONFIRMED
            );

        assert.equal(
            updatedOrder.estado,
            ORDER_STATUS.CONFIRMED
        );

        assert.ok(
            updatedOrder.fechaActualizacion
        );

        /*
         * Se consulta nuevamente el repositorio para comprobar
         * que el cambio no exista únicamente en el resultado
         * devuelto por el servicio.
         */
        const storedOrder =
            buscarPedidoPorId(order.id);

        assert.ok(storedOrder);

        assert.equal(
            storedOrder.estado,
            ORDER_STATUS.CONFIRMED
        );

        assert.ok(
            storedOrder.fechaActualizacion
        );

    }
);

test(
    "cambiarEstadoPedido rechaza una transición no permitida",
    () => {

        const order =
            createStoredOrder();

        assert.throws(
            () => {

                cambiarEstadoPedido(
                    order.id,
                    ORDER_STATUS.DELIVERED
                );

            },
            {
                message:
                    'No se permite cambiar el pedido de "Pendiente" a "Entregado".'
            }
        );

        /*
         * El pedido debe conservar el estado original después
         * del intento rechazado.
         */
        const storedOrder =
            buscarPedidoPorId(order.id);

        assert.equal(
            storedOrder.estado,
            ORDER_STATUS.PENDING
        );

    }
);

test(
    "cambiarEstadoPedido rechaza un pedido inexistente",
    () => {

        limpiarPedidos();

        assert.throws(
            () => {

                cambiarEstadoPedido(
                    "PED-999999",
                    ORDER_STATUS.CONFIRMED
                );

            },
            {
                message:
                    "No se encontró el pedido PED-999999."
            }
        );

    }
);