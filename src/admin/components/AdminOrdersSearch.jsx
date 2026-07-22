/**
 * ===========================================================
 * AdminOrdersSearch.jsx
 * -----------------------------------------------------------
 * Campo de búsqueda utilizado en el módulo administrativo
 * de pedidos.
 *
 * Responsabilidades:
 *
 * - recibir el texto de búsqueda;
 * - notificar los cambios al componente padre;
 * - permitir limpiar rápidamente la búsqueda.
 *
 * Este componente no conoce la estructura de los pedidos
 * ni realiza filtrados.
 * ===========================================================
 */

export default function AdminOrdersSearch({
    value = "",
    onChange,
    onClear
}) {

    function handleChange(event) {

        if (
            typeof onChange ===
            "function"
        ) {

            onChange(
                event.target.value
            );

        }

    }

    function handleClear() {

        if (
            typeof onClear ===
            "function"
        ) {

            onClear();

        }

    }

    return (

        <div className="admin-orders-search">

            <label
                htmlFor="admin-orders-search-input"
                className="admin-orders-search-label"
            >

                Buscar pedidos

            </label>

            <div className="admin-orders-search-control">

                <span
                    className="admin-orders-search-icon"
                    aria-hidden="true"
                >

                    🔎

                </span>

                <input
                    id="admin-orders-search-input"
                    type="search"
                    value={value}
                    onChange={handleChange}
                    placeholder="ID, cliente o teléfono"
                    autoComplete="off"
                />

                {
                    value && (

                        <button
                            type="button"
                            className="admin-orders-search-clear"
                            onClick={handleClear}
                            aria-label="Limpiar búsqueda"
                        >

                            ×

                        </button>

                    )
                }

            </div>

        </div>

    );

}