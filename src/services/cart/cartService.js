/**
 * ===========================================================
 * cartService.js
 * -----------------------------------------------------------
 * Servicio responsable de administrar el carrito.
 *
 * Sus funciones son inmutables:
 *
 * - No modifican directamente el arreglo recibido.
 * - Siempre devuelven un carrito nuevo.
 * - No dependen de React ni del chatbot.
 * ===========================================================
 */

/**
 * Verifica que el carrito sea un arreglo.
 *
 * @param {Array} cart
 */
function validateCart(cart) {

    if (!Array.isArray(cart)) {

        throw new TypeError(
            "El carrito debe ser un arreglo."
        );

    }

}

/**
 * Verifica que un producto tenga los datos mínimos.
 *
 * @param {Object} product
 */
function validateProduct(product) {

    if (
        !product ||
        product.id === undefined ||
        !product.nombre ||
        !Number.isFinite(product.precio) ||
        product.precio < 0
    ) {

        throw new TypeError(
            "El producto no tiene una estructura válida."
        );

    }

}

/**
 * Verifica que la cantidad sea un entero positivo.
 *
 * @param {number} quantity
 */
function validateQuantity(quantity) {

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        throw new RangeError(
            "La cantidad debe ser un número entero mayor que cero."
        );

    }

}

/**
 * Agrega un producto al carrito.
 *
 * Si el producto ya existe, acumula la cantidad.
 *
 * @param {Array} cart
 * @param {Object} product
 * @param {number} quantity
 *
 * @returns {Array}
 */
export function addProduct(
    cart,
    product,
    quantity
) {

    validateCart(cart);
    validateProduct(product);
    validateQuantity(quantity);

    const existingItem = cart.find(
        (item) => item.productoId === product.id
    );

    if (existingItem) {

        return cart.map((item) => {

            if (item.productoId !== product.id) {

                return {
                    ...item
                };

            }

            const newQuantity =
                item.cantidad + quantity;

            return {
                ...item,
                cantidad: newQuantity,
                subtotal: item.precio * newQuantity
            };

        });

    }

    const newItem = {
        productoId: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: quantity,
        subtotal: product.precio * quantity
    };

    return [
        ...cart.map((item) => ({
            ...item
        })),
        newItem
    ];

}

/**
 * Elimina un producto del carrito.
 *
 * @param {Array} cart
 * @param {number|string} productId
 *
 * @returns {Array}
 */
export function removeProduct(
    cart,
    productId
) {

    validateCart(cart);

    const numericProductId = Number(productId);

    return cart
        .filter(
            (item) =>
                item.productoId !== numericProductId
        )
        .map((item) => ({
            ...item
        }));

}

/**
 * Actualiza la cantidad de un producto.
 *
 * @param {Array} cart
 * @param {number|string} productId
 * @param {number} quantity
 *
 * @returns {Array}
 */
export function updateQuantity(
    cart,
    productId,
    quantity
) {

    validateCart(cart);
    validateQuantity(quantity);

    const numericProductId = Number(productId);

    const productExists = cart.some(
        (item) =>
            item.productoId === numericProductId
    );

    if (!productExists) {

        throw new Error(
            "El producto no existe en el carrito."
        );

    }

    return cart.map((item) => {

        if (
            item.productoId !== numericProductId
        ) {

            return {
                ...item
            };

        }

        return {
            ...item,
            cantidad: quantity,
            subtotal: item.precio * quantity
        };

    });

}

/**
 * Vacía completamente el carrito.
 *
 * @returns {Array}
 */
export function clearCart() {

    return [];

}

/**
 * Calcula el número total de unidades.
 *
 * Ejemplo:
 *
 * 2 arroces + 3 aceites = 5 unidades.
 *
 * @param {Array} cart
 * @returns {number}
 */
export function countCartUnits(cart) {

    validateCart(cart);

    return cart.reduce(
        (total, item) =>
            total + item.cantidad,
        0
    );

}

/**
 * Indica si el carrito está vacío.
 *
 * @param {Array} cart
 * @returns {boolean}
 */
export function isCartEmpty(cart) {

    validateCart(cart);

    return cart.length === 0;

}