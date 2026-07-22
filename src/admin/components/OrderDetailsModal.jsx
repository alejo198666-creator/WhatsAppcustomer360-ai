/**
 * ===========================================================
 * OrderDetailsModal.jsx
 * -----------------------------------------------------------
 * Modal de consulta del detalle completo de un pedido.
 *
 * Responsabilidades:
 *
 * - mostrar información general del pedido;
 * - mostrar información del cliente;
 * - presentar los productos y sus valores;
 * - permitir cerrar el modal.
 *
 * Este componente no modifica información.
 * ===========================================================
 */

import {
    useEffect
} from "react";

/**
 * Formatea valores monetarios como pesos colombianos.
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
function formatCurrency(value) {

    const numericValue =
        Number(value) || 0;

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(numericValue);

}

/**
 * Formatea una fecha válida.
 *
 * @param {Date|string|null|undefined} value
 * @returns {string}
 */
function formatDate(value) {

    if (!value) {

        return "No registrada";

    }

    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Fecha no disponible";

    }

    return new Intl.DateTimeFormat(
        "es-CO",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);

}

/**
 * Obtiene el nombre visible de un producto.
 *
 * Admite diferentes nombres de propiedades para evitar
 * fallos mientras el proyecto evoluciona.
 *
 * @param {Object} product
 * @returns {string}
 */
function getProductName(product) {

    return (
        product?.nombre ??
        product?.name ??
        product?.producto ??
        "Producto sin nombre"
    );

}

/**
 * Obtiene la cantidad registrada de un producto.
 *
 * @param {Object} product
 * @returns {number}
 */
function getProductQuantity(product) {

    const quantity =
        Number(
            product?.cantidad ??
            product?.quantity ??
            0
        );

    return Number.isFinite(quantity)
        ? quantity
        : 0;

}

/**
 * Obtiene el precio unitario de un producto.
 *
 * @param {Object} product
 * @returns {number}
 */
function getProductUnitPrice(product) {

    const unitPrice =
        Number(
            product?.precio ??
            product?.precioUnitario ??
            product?.unitPrice ??
            0
        );

    return Number.isFinite(unitPrice)
        ? unitPrice
        : 0;

}

/**
 * Obtiene o calcula el subtotal de un producto.
 *
 * @param {Object} product
 * @returns {number}
 */
function getProductSubtotal(product) {

    const storedSubtotal =
        Number(
            product?.subtotal
        );

    if (
        Number.isFinite(storedSubtotal)
    ) {

        return storedSubtotal;

    }

    return (
        getProductQuantity(product) *
        getProductUnitPrice(product)
    );

}

/**
 * Modal de detalle del pedido.
 *
 * @param {Object} props
 * @param {Object|null} props.order
 * @param {Function} props.onClose
 */
export default function OrderDetailsModal({
    order,
    onClose
}) {

    useEffect(() => {

        function handleKeyDown(event) {

            if (
                event.key ===
                "Escape"
            ) {

                onClose();

            }

        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [onClose]);

    if (!order) {

        return null;

    }

    const products =
        Array.isArray(order.productos)
            ? order.productos
            : [];

    function handleOverlayClick(event) {

        if (
            event.target ===
            event.currentTarget
        ) {

            onClose();

        }

    }

    return (

        <div
            className="admin-modal-overlay"
            onMouseDown={handleOverlayClick}
            role="presentation"
        >

            <section
                className="
                    admin-modal
                    admin-order-details-modal
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-details-title"
            >

                <header className="admin-details-modal-header">

                    <div>

                        <p className="admin-order-label">

                            Detalle del pedido

                        </p>

                        <h2 id="order-details-title">

                            {order.id}

                        </h2>

                    </div>

                    <button
                        type="button"
                        className="admin-modal-close-button"
                        onClick={onClose}
                        aria-label="Cerrar detalle del pedido"
                    >

                        ×

                    </button>

                </header>

                <div className="admin-details-status-row">

                    <span>

                        Estado actual

                    </span>

                    <strong className="admin-order-status">

                        {
                            order.estado ||
                            "Sin estado"
                        }

                    </strong>

                </div>

                <section className="admin-details-section">

                    <h3>

                        Información del cliente

                    </h3>

                    <dl className="admin-details-grid">

                        <div>

                            <dt>

                                Nombre

                            </dt>

                            <dd>

                                {
                                    order.cliente
                                        ?.nombre ||
                                    "No registrado"
                                }

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Teléfono

                            </dt>

                            <dd>

                                {
                                    order.cliente
                                        ?.telefono ||
                                    "No registrado"
                                }

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Correo electrónico

                            </dt>

                            <dd>

                                {
                                    order.cliente
                                        ?.email ||
                                    order.cliente
                                        ?.correo ||
                                    "No registrado"
                                }

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Dirección

                            </dt>

                            <dd>

                                {
                                    order.cliente
                                        ?.direccion ||
                                    "No registrada"
                                }

                            </dd>

                        </div>

                    </dl>

                </section>

                <section className="admin-details-section">

                    <h3>

                        Información del pedido

                    </h3>

                    <dl className="admin-details-grid">

                        <div>

                            <dt>

                                Fecha de creación

                            </dt>

                            <dd>

                                {
                                    formatDate(
                                        order.fechaCreacion
                                    )
                                }

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Última actualización

                            </dt>

                            <dd>

                                {
                                    formatDate(
                                        order.fechaActualizacion
                                    )
                                }

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Cantidad de productos

                            </dt>

                            <dd>

                                {products.length}

                            </dd>

                        </div>

                        <div>

                            <dt>

                                Total de unidades

                            </dt>

                            <dd>

                                {
                                    products.reduce(
                                        (
                                            total,
                                            product
                                        ) =>
                                            total +
                                            getProductQuantity(
                                                product
                                            ),
                                        0
                                    )
                                }

                            </dd>

                        </div>

                    </dl>

                </section>

                <section className="admin-details-section">

                    <h3>

                        Productos

                    </h3>

                    {
                        products.length === 0
                            ? (
                                <div className="admin-details-empty">

                                    Este pedido no tiene
                                    productos registrados.

                                </div>
                            )
                            : (
                                <div className="admin-products-table-wrapper">

                                    <table className="admin-products-table">

                                        <thead>

                                            <tr>

                                                <th>

                                                    Producto

                                                </th>

                                                <th>

                                                    Cantidad

                                                </th>

                                                <th>

                                                    Precio unitario

                                                </th>

                                                <th>

                                                    Subtotal

                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                products.map(
                                                    (
                                                        product,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                product.id ??
                                                                product.productId ??
                                                                `${getProductName(product)}-${index}`
                                                            }
                                                        >

                                                            <td>

                                                                {
                                                                    getProductName(
                                                                        product
                                                                    )
                                                                }

                                                            </td>

                                                            <td>

                                                                {
                                                                    getProductQuantity(
                                                                        product
                                                                    )
                                                                }

                                                            </td>

                                                            <td>

                                                                {
                                                                    formatCurrency(
                                                                        getProductUnitPrice(
                                                                            product
                                                                        )
                                                                    )
                                                                }

                                                            </td>

                                                            <td>

                                                                <strong>

                                                                    {
                                                                        formatCurrency(
                                                                            getProductSubtotal(
                                                                                product
                                                                            )
                                                                        )
                                                                    }

                                                                </strong>

                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>
                            )
                    }

                </section>

                <footer className="admin-details-modal-footer">

                    <div>

                        <span>

                            Total del pedido

                        </span>

                        <strong>

                            {
                                formatCurrency(
                                    order.total
                                )
                            }

                        </strong>

                    </div>

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={onClose}
                    >

                        Cerrar

                    </button>

                </footer>

            </section>

        </div>

    );

}