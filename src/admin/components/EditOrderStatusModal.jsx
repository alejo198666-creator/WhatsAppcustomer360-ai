import {
    useEffect,
    useState
} from "react";

export default function EditOrderStatusModal({
    order,
    allowedStatuses = [],
    errorMessage = "",
    onCancel,
    onSave
}) {

    const [
        selectedStatus,
        setSelectedStatus
    ] = useState("");

    useEffect(() => {

        if (
            allowedStatuses.length > 0
        ) {

            setSelectedStatus(
                allowedStatuses[0]
            );

        } else {

            setSelectedStatus("");

        }

    }, [allowedStatuses]);

    useEffect(() => {

        function handleKeyDown(event) {

            if (
                event.key ===
                "Escape"
            ) {

                onCancel();

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

    }, [onCancel]);

    if (!order) {

        return null;

    }

    function handleSubmit(event) {

        event.preventDefault();

        if (!selectedStatus) {

            return;

        }

        onSave(selectedStatus);

    }

    function handleOverlayClick(event) {

        if (
            event.target ===
            event.currentTarget
        ) {

            onCancel();

        }

    }

    return (

        <div
            className="admin-modal-overlay"
            onMouseDown={handleOverlayClick}
            role="presentation"
        >

            <section
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-order-status-title"
            >

                <h2 id="edit-order-status-title">

                    Actualizar estado

                </h2>

                <p>

                    Pedido:

                    <strong>

                        {" "}
                        {order.id}

                    </strong>

                </p>

                <p>

                    Estado actual:

                    <strong>

                        {" "}
                        {order.estado}

                    </strong>

                </p>

                <form
                    onSubmit={handleSubmit}
                >

                    <label
                        htmlFor="new-order-status"
                    >

                        Nuevo estado

                    </label>

                    <select
                        id="new-order-status"
                        value={selectedStatus}
                        onChange={(event) => {

                            setSelectedStatus(
                                event.target.value
                            );

                        }}
                        disabled={
                            allowedStatuses.length === 0
                        }
                    >

                        {
                            allowedStatuses.map(
                                (status) => (

                                    <option
                                        key={status}
                                        value={status}
                                    >

                                        {status}

                                    </option>

                                )
                            )
                        }

                    </select>

                    {
                        errorMessage && (

                            <p
                                className="admin-modal-error"
                                role="alert"
                            >

                                {errorMessage}

                            </p>

                        )
                    }

                    <div className="admin-modal-buttons">

                        <button
                            type="button"
                            onClick={onCancel}
                        >

                            Cancelar

                        </button>

                        <button
                            type="submit"
                            disabled={
                                !selectedStatus
                            }
                        >

                            Guardar cambios

                        </button>

                    </div>

                </form>

            </section>

        </div>

    );

}