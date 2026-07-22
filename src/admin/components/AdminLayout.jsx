/**
 * ===========================================================
 * AdminLayout.jsx
 * -----------------------------------------------------------
 * Estructura principal del Centro de Administración.
 *
 * Responsabilidades:
 *
 * - presentar el encabezado administrativo;
 * - mostrar las opciones principales del CRM;
 * - permitir abrir el módulo de pedidos;
 * - permitir regresar al modo conversacional.
 * ===========================================================
 */

/**
 * Centro de Administración.
 *
 * @param {Object} props
 * @param {Function} props.onExit
 * @param {Function} props.onOpenOrders
 */
export default function AdminLayout({
    onExit,
    onOpenOrders
}) {

    function handleExit() {

        if (
            typeof onExit ===
            "function"
        ) {

            onExit();

        }

    }

    function handleOpenOrders() {

        if (
            typeof onOpenOrders ===
            "function"
        ) {

            onOpenOrders();

        }

    }

    return (

        <main className="admin-layout">

            <header className="admin-header">

                <div>

                    <p className="admin-header-label">

                        Customer360 AI

                    </p>

                    <h1>

                        Centro de Administración

                    </h1>

                    <p>

                        Gestión interna de pedidos,
                        clientes y productos.

                    </p>

                </div>

                <button
                    type="button"
                    className="admin-exit-button"
                    onClick={handleExit}
                >

                    Volver al chat

                </button>

            </header>

            <section
                className="admin-module-grid"
                aria-label="Módulos administrativos"
            >

                <article className="admin-module-card">

                    <span
                        className="admin-module-icon"
                        aria-hidden="true"
                    >

                        📋

                    </span>

                    <h2>

                        Pedidos

                    </h2>

                    <p>

                        Consulta los pedidos registrados
                        y administra su estado.

                    </p>

                    <button
                        type="button"
                        className="admin-module-button"
                        onClick={handleOpenOrders}
                    >

                        Abrir pedidos

                    </button>

                </article>

                <article className="admin-module-card">

                    <span
                        className="admin-module-icon"
                        aria-hidden="true"
                    >

                        👥

                    </span>

                    <h2>

                        Clientes

                    </h2>

                    <p>

                        Consulta la información de los
                        clientes registrados.

                    </p>

                    <button
                        type="button"
                        className="admin-module-button"
                        disabled
                    >

                        Próximamente

                    </button>

                </article>

                <article className="admin-module-card">

                    <span
                        className="admin-module-icon"
                        aria-hidden="true"
                    >

                        📦

                    </span>

                    <h2>

                        Productos

                    </h2>

                    <p>

                        Administra el catálogo disponible
                        para las conversaciones.

                    </p>

                    <button
                        type="button"
                        className="admin-module-button"
                        disabled
                    >

                        Próximamente

                    </button>

                </article>

                <article className="admin-module-card">

                    <span
                        className="admin-module-icon"
                        aria-hidden="true"
                    >

                        📊

                    </span>

                    <h2>

                        Reportes

                    </h2>

                    <p>

                        Visualiza indicadores relacionados
                        con la operación del CRM.

                    </p>

                    <button
                        type="button"
                        className="admin-module-button"
                        disabled
                    >

                        Próximamente

                    </button>

                </article>

            </section>

        </main>

    );

}