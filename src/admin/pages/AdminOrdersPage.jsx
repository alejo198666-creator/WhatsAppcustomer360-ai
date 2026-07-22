/**
 * ===========================================================
 * AdminOrdersPage.jsx
 * -----------------------------------------------------------
 * Pantalla administrativa para consultar y gestionar
 * los pedidos registrados en Customer360 AI.
 *
 * Responsabilidades:
 *
 * - consultar pedidos desde el repositorio;
 * - ordenar los pedidos por fecha;
 * - filtrar pedidos por estado;
 * - buscar por ID, cliente o teléfono;
 * - abrir el detalle completo de un pedido;
 * - actualizar el estado mediante el servicio de dominio;
 * - refrescar el listado después de una modificación.
 * ===========================================================
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    obtenerPedidos
} from "../../services/database/pedidoRepository.js";

import {
    cambiarEstadoPedido,
    getAllowedOrderStatuses
} from "../../services/orders/orderService.js";

import {
    ORDER_STATUS_LIST
} from "../../constants/orderStatus.js";

import EditOrderStatusModal from "../components/EditOrderStatusModal.jsx";

import OrderDetailsModal from "../components/OrderDetailsModal.jsx";

import AdminOrdersSearch from "../components/AdminOrdersSearch.jsx";

/**
 * Valor especial utilizado para mostrar todos los estados.
 */
const ALL_STATUSES = "ALL";

/**
 * Formatea un valor como moneda colombiana.
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
function formatCurrency(value) {

    const normalizedValue =
        Number(value) || 0;

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(normalizedValue);

}

/**
 * Formatea una fecha almacenada como Date o cadena.
 *
 * @param {Date|string|null|undefined} value
 * @returns {string}
 */
function formatDate(value) {

    if (!value) {

        return "Sin fecha";

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
 * Obtiene una fecha utilizable para ordenar pedidos.
 *
 * @param {Object} order
 * @returns {number}
 */
function getOrderTimestamp(order) {

    const date =
        new Date(
            order?.fechaCreacion
        );

    const timestamp =
        date.getTime();

    return Number.isNaN(timestamp)
        ? 0
        : timestamp;

}

/**
 * Normaliza texto para realizar comparaciones:
 *
 * - convierte a minúsculas;
 * - elimina tildes;
 * - elimina espacios al inicio y al final.
 *
 * Esto permite que "Maria" encuentre también "María".
 *
 * @param {unknown} value
 * @returns {string}
 */
function normalizeSearchText(value) {

    return String(
        value ?? ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}

/**
 * Determina si un pedido coincide con la búsqueda.
 *
 * Campos evaluados:
 *
 * - ID del pedido;
 * - nombre del cliente;
 * - teléfono del cliente.
 *
 * @param {Object} order
 * @param {string} searchTerm
 * @returns {boolean}
 */
function matchesOrderSearch(
    order,
    searchTerm
) {

    const normalizedTerm =
        normalizeSearchText(
            searchTerm
        );

    if (!normalizedTerm) {

        return true;

    }

    const searchableValues = [
        order?.id,
        order?.cliente?.nombre,
        order?.cliente?.telefono
    ];

    return searchableValues.some(
        (value) =>
            normalizeSearchText(
                value
            ).includes(
                normalizedTerm
            )
    );

}

/**
 * Pantalla de administración de pedidos.
 *
 * @param {Object} props
 * @param {Function} props.onBack
 */
export default function AdminOrdersPage({
    onBack
}) {

    const [
        orders,
        setOrders
    ] = useState([]);

    const [
        selectedStatusFilter,
        setSelectedStatusFilter
    ] = useState(ALL_STATUSES);

    const [
        searchTerm,
        setSearchTerm
    ] = useState("");

    const [
        orderBeingEdited,
        setOrderBeingEdited
    ] = useState(null);

    const [
        selectedOrderDetails,
        setSelectedOrderDetails
    ] = useState(null);

    const [
        allowedStatuses,
        setAllowedStatuses
    ] = useState([]);

    const [
        feedbackMessage,
        setFeedbackMessage
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage
    ] = useState("");

    /**
     * Consulta y ordena nuevamente los pedidos.
     */
    const loadOrders =
        useCallback(() => {

            const storedOrders =
                obtenerPedidos();

            const normalizedOrders =
                Array.isArray(storedOrders)
                    ? storedOrders
                    : [];

            const sortedOrders = [
                ...normalizedOrders
            ].sort(
                (
                    firstOrder,
                    secondOrder
                ) =>
                    getOrderTimestamp(
                        secondOrder
                    ) -
                    getOrderTimestamp(
                        firstOrder
                    )
            );

            setOrders(sortedOrders);

        }, []);

    useEffect(() => {

        loadOrders();

    }, [loadOrders]);

    /**
     * Pedidos visibles después de aplicar:
     *
     * 1. filtro por estado;
     * 2. búsqueda por texto.
     */
    const filteredOrders =
        useMemo(() => {

            return orders.filter(
                (order) => {

                    const matchesStatus =
                        selectedStatusFilter ===
                            ALL_STATUSES ||
                        order.estado ===
                            selectedStatusFilter;

                    const matchesSearch =
                        matchesOrderSearch(
                            order,
                            searchTerm
                        );

                    return (
                        matchesStatus &&
                        matchesSearch
                    );

                }
            );

        }, [
            orders,
            selectedStatusFilter,
            searchTerm
        ]);

    /**
     * Conteos agrupados por estado.
     *
     * Estos conteos representan el total general y no cambian
     * al escribir en el buscador.
     */
    const orderCounts =
        useMemo(() => {

            const counts = {
                [ALL_STATUSES]: orders.length
            };

            ORDER_STATUS_LIST.forEach(
                (status) => {

                    counts[status] = 0;

                }
            );

            orders.forEach(
                (order) => {

                    if (
                        Object.prototype
                            .hasOwnProperty
                            .call(
                                counts,
                                order.estado
                            )
                    ) {

                        counts[order.estado] += 1;

                    }

                }
            );

            return counts;

        }, [orders]);

    function handleBack() {

        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

        }

    }

    /**
     * Actualiza el texto de búsqueda.
     *
     * @param {string} newValue
     */
    function handleSearchChange(
        newValue
    ) {

        setSearchTerm(newValue);

    }

    /**
     * Limpia únicamente la búsqueda.
     *
     * El filtro por estado seleccionado se conserva.
     */
    function handleClearSearch() {

        setSearchTerm("");

    }

    /**
     * Limpia tanto la búsqueda como el filtro por estado.
     */
    function handleClearAllFilters() {

        setSearchTerm("");

        setSelectedStatusFilter(
            ALL_STATUSES
        );

    }

    /**
     * Abre la consulta completa del pedido.
     *
     * @param {Object} order
     */
    function handleOpenDetails(order) {

        setSelectedOrderDetails(order);

    }

    function handleCloseDetails() {

        setSelectedOrderDetails(null);

    }

    /**
     * Abre el modal de edición y consulta las transiciones
     * permitidas mediante el servicio de dominio.
     *
     * @param {Object} order
     */
    function handleOpenEditModal(order) {

        const nextStatuses =
            getAllowedOrderStatuses(
                order.estado
            );

        setOrderBeingEdited(order);
        setAllowedStatuses(nextStatuses);
        setFeedbackMessage("");
        setErrorMessage("");

    }

    function handleCloseEditModal() {

        setOrderBeingEdited(null);
        setAllowedStatuses([]);
        setErrorMessage("");

    }

    /**
     * Actualiza el estado mediante el servicio de pedidos.
     *
     * @param {string} newStatus
     */
    function handleSaveStatus(newStatus) {

        if (!orderBeingEdited) {

            return;

        }

        try {

            const updatedOrder =
                cambiarEstadoPedido(
                    orderBeingEdited.id,
                    newStatus
                );

            if (!updatedOrder) {

                throw new Error(
                    "No se encontró el pedido que deseas actualizar."
                );

            }

            setFeedbackMessage(
                `El pedido ${orderBeingEdited.id} fue actualizado a ${newStatus}.`
            );

            setErrorMessage("");

            handleCloseEditModal();

            loadOrders();

        } catch (error) {

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No fue posible actualizar el pedido."
            );

        }

    }

    const hasActiveFilters =
        selectedStatusFilter !==
            ALL_STATUSES ||
        normalizeSearchText(
            searchTerm
        ).length > 0;

    return (

        <main className="admin-layout">

            <header className="admin-header">

                <div>

                    <p className="admin-header-label">

                        Customer360 AI

                    </p>

                    <h1>

                        Gestión de pedidos

                    </h1>

                    <p>

                        Consulta y administra los pedidos
                        realizados desde el canal
                        conversacional.

                    </p>

                </div>

                <button
                    type="button"
                    className="admin-exit-button"
                    onClick={handleBack}
                >

                    Volver al menú

                </button>

            </header>

            <section
                className="admin-orders-section"
                aria-labelledby="admin-orders-title"
            >

                <div className="admin-orders-toolbar">

                    <div>

                        <h2 id="admin-orders-title">

                            Pedidos registrados

                        </h2>

                        <p>

                            Mostrando {
                                filteredOrders.length
                            } de {
                                orders.length
                            } pedidos

                        </p>

                    </div>

                    <button
                        type="button"
                        className="admin-refresh-button"
                        onClick={loadOrders}
                    >

                        Actualizar listado

                    </button>

                </div>

                {
                    feedbackMessage && (

                        <div
                            className="admin-feedback-message"
                            role="status"
                        >

                            {feedbackMessage}

                        </div>

                    )
                }

                <div className="admin-orders-query-panel">

                    <AdminOrdersSearch
                        value={searchTerm}
                        onChange={
                            handleSearchChange
                        }
                        onClear={
                            handleClearSearch
                        }
                    />

                    {
                        hasActiveFilters && (

                            <button
                                type="button"
                                className="admin-clear-filters-button"
                                onClick={
                                    handleClearAllFilters
                                }
                            >

                                Limpiar filtros

                            </button>

                        )
                    }

                </div>

                <div
                    className="admin-status-filters"
                    aria-label="Filtrar pedidos por estado"
                >

                    <button
                        type="button"
                        className={
                            selectedStatusFilter ===
                            ALL_STATUSES
                                ? "admin-status-filter active"
                                : "admin-status-filter"
                        }
                        aria-pressed={
                            selectedStatusFilter ===
                            ALL_STATUSES
                        }
                        onClick={() => {

                            setSelectedStatusFilter(
                                ALL_STATUSES
                            );

                        }}
                    >

                        Todos

                        <span>

                            {
                                orderCounts[
                                    ALL_STATUSES
                                ] ?? 0
                            }

                        </span>

                    </button>

                    {
                        ORDER_STATUS_LIST.map(
                            (status) => (

                                <button
                                    key={status}
                                    type="button"
                                    className={
                                        selectedStatusFilter ===
                                        status
                                            ? "admin-status-filter active"
                                            : "admin-status-filter"
                                    }
                                    aria-pressed={
                                        selectedStatusFilter ===
                                        status
                                    }
                                    onClick={() => {

                                        setSelectedStatusFilter(
                                            status
                                        );

                                    }}
                                >

                                    {status}

                                    <span>

                                        {
                                            orderCounts[
                                                status
                                            ] ?? 0
                                        }

                                    </span>

                                </button>

                            )
                        )
                    }

                </div>

                {
                    filteredOrders.length === 0
                        ? (
                            <div className="admin-empty-state">

                                <span
                                    aria-hidden="true"
                                    className="admin-empty-icon"
                                >

                                    🔍

                                </span>

                                <h3>

                                    No se encontraron pedidos

                                </h3>

                                <p>

                                    No existen pedidos que
                                    coincidan con la búsqueda
                                    y el estado seleccionados.

                                </p>

                                {
                                    hasActiveFilters && (

                                        <button
                                            type="button"
                                            className="admin-refresh-button"
                                            onClick={
                                                handleClearAllFilters
                                            }
                                        >

                                            Mostrar todos

                                        </button>

                                    )
                                }

                            </div>
                        )
                        : (
                            <div className="admin-orders-list">

                                {
                                    filteredOrders.map(
                                        (order) => {

                                            const availableStatuses =
                                                getAllowedOrderStatuses(
                                                    order.estado
                                                );

                                            const hasAvailableTransitions =
                                                availableStatuses.length > 0;

                                            const productsCount =
                                                Array.isArray(
                                                    order.productos
                                                )
                                                    ? order.productos.length
                                                    : 0;

                                            return (

                                                <article
                                                    key={order.id}
                                                    className="admin-order-card"
                                                >

                                                    <div className="admin-order-header">

                                                        <div>

                                                            <p className="admin-order-label">

                                                                Pedido

                                                            </p>

                                                            <h3>

                                                                {order.id}

                                                            </h3>

                                                        </div>

                                                        <span className="admin-order-status">

                                                            {
                                                                order.estado
                                                            }

                                                        </span>

                                                    </div>

                                                    <dl className="admin-order-details">

                                                        <div>

                                                            <dt>

                                                                Cliente

                                                            </dt>

                                                            <dd>

                                                                {
                                                                    order.cliente
                                                                        ?.nombre ||
                                                                    "Sin nombre"
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

                                                                Productos

                                                            </dt>

                                                            <dd>

                                                                {
                                                                    productsCount
                                                                }

                                                            </dd>

                                                        </div>

                                                        <div>

                                                            <dt>

                                                                Fecha

                                                            </dt>

                                                            <dd>

                                                                {
                                                                    formatDate(
                                                                        order.fechaCreacion
                                                                    )
                                                                }

                                                            </dd>

                                                        </div>

                                                    </dl>

                                                    <div className="admin-order-footer">

                                                        <div>

                                                            <span>

                                                                Total

                                                            </span>

                                                            <strong>

                                                                {
                                                                    formatCurrency(
                                                                        order.total
                                                                    )
                                                                }

                                                            </strong>

                                                        </div>

                                                        <div className="admin-order-actions">

                                                            <button
                                                                type="button"
                                                                className="admin-order-details-button"
                                                                onClick={() => {

                                                                    handleOpenDetails(
                                                                        order
                                                                    );

                                                                }}
                                                            >

                                                                Ver detalle

                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="admin-order-edit-button"
                                                                onClick={() => {

                                                                    handleOpenEditModal(
                                                                        order
                                                                    );

                                                                }}
                                                                disabled={
                                                                    !hasAvailableTransitions
                                                                }
                                                            >

                                                                {
                                                                    hasAvailableTransitions
                                                                        ? "Editar estado"
                                                                        : "Estado final"
                                                                }

                                                            </button>

                                                        </div>

                                                    </div>

                                                </article>

                                            );

                                        }
                                    )
                                }

                            </div>
                        )
                }

            </section>

            {
                selectedOrderDetails && (

                    <OrderDetailsModal
                        order={
                            selectedOrderDetails
                        }
                        onClose={
                            handleCloseDetails
                        }
                    />

                )
            }

            {
                orderBeingEdited && (

                    <EditOrderStatusModal
                        order={
                            orderBeingEdited
                        }
                        allowedStatuses={
                            allowedStatuses
                        }
                        errorMessage={
                            errorMessage
                        }
                        onCancel={
                            handleCloseEditModal
                        }
                        onSave={
                            handleSaveStatus
                        }
                    />

                )
            }

        </main>

    );

}