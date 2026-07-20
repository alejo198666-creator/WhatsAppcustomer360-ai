/**
 * ===========================================================
 * pricingService.js
 * -----------------------------------------------------------
 * Servicio responsable de realizar cálculos monetarios.
 *
 * Actualmente:
 *
 * - Subtotal.
 * - Impuesto.
 * - Descuento.
 * - Total.
 *
 * En esta versión el impuesto y el descuento son cero.
 * ===========================================================
 */

/**
 * Valida que el carrito sea un arreglo.
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
 * Calcula la suma de los subtotales.
 *
 * @param {Array} cart
 * @returns {number}
 */
export function calculateSubtotal(cart) {

    validateCart(cart);

    return cart.reduce(
        (total, item) => {

            const itemSubtotal =
                Number(item.subtotal);

            if (!Number.isFinite(itemSubtotal)) {

                throw new TypeError(
                    "Uno de los productos tiene un subtotal inválido."
                );

            }

            return total + itemSubtotal;

        },
        0
    );

}

/**
 * Calcula impuestos.
 *
 * En la versión actual no se aplica impuesto adicional.
 *
 * @param {number} subtotal
 * @returns {number}
 */
export function calculateTax(subtotal) {

    if (
        !Number.isFinite(subtotal) ||
        subtotal < 0
    ) {

        throw new TypeError(
            "El subtotal debe ser un número válido."
        );

    }

    return 0;

}

/**
 * Calcula descuentos.
 *
 * En la versión actual no se aplican descuentos.
 *
 * @param {number} subtotal
 * @returns {number}
 */
export function calculateDiscount(subtotal) {

    if (
        !Number.isFinite(subtotal) ||
        subtotal < 0
    ) {

        throw new TypeError(
            "El subtotal debe ser un número válido."
        );

    }

    return 0;

}

/**
 * Calcula todos los valores de la venta.
 *
 * @param {Array} cart
 *
 * @returns {{
 *   subtotal: number,
 *   tax: number,
 *   discount: number,
 *   total: number
 * }}
 */
export function calculatePricing(cart) {

    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const discount =
        calculateDiscount(subtotal);

    const total =
        subtotal +
        tax -
        discount;

    return {
        subtotal,
        tax,
        discount,
        total
    };

}