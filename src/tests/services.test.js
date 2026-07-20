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
    buildOrder
} from "../services/orders/orderService.js";

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
            "Pendiente"
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