/**
 * ===========================================================
 * AdminAccessModal.jsx
 * -----------------------------------------------------------
 * Modal utilizado para solicitar el PIN del administrador.
 *
 * Responsabilidades:
 *
 * - capturar el PIN;
 * - enviar el PIN al controlador;
 * - mostrar errores de validación;
 * - permitir cancelar el acceso;
 * - gestionar el foco inicial;
 * - permitir cerrar mediante la tecla Escape.
 * ===========================================================
 */

import {
    useEffect,
    useRef,
    useState
} from "react";

/**
 * Modal de acceso administrativo.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.errorMessage
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit
 */
export default function AdminAccessModal({
    isOpen,
    errorMessage = "",
    onClose,
    onSubmit
}) {

    const [
        pin,
        setPin
    ] = useState("");

    const inputRef =
        useRef(null);

    /*
     * Limpia el PIN y enfoca el campo cada vez que
     * se abre el modal.
     */
    useEffect(() => {

        if (!isOpen) {

            return undefined;

        }

        setPin("");

        const focusTimer =
            window.setTimeout(() => {

                inputRef.current?.focus();

            }, 0);

        return () => {

            window.clearTimeout(
                focusTimer
            );

        };

    }, [isOpen]);

    /*
     * Permite cerrar el modal con la tecla Escape.
     */
    useEffect(() => {

        if (!isOpen) {

            return undefined;

        }

        function handleKeyDown(event) {

            if (event.key !== "Escape") {

                return;

            }

            event.preventDefault();

            if (
                typeof onClose ===
                "function"
            ) {

                onClose();

            }

        }

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        isOpen,
        onClose
    ]);

    if (!isOpen) {

        return null;

    }

    /**
     * Envía el PIN al controlador.
     *
     * @param {React.FormEvent<HTMLFormElement>} event
     */
    function handleSubmit(event) {

        event.preventDefault();

        if (
            typeof onSubmit ===
            "function"
        ) {

            onSubmit(pin);

        }

    }

    /**
     * Cierra el modal al hacer clic directamente
     * sobre el fondo oscuro.
     *
     * @param {React.MouseEvent<HTMLDivElement>} event
     */
    function handleOverlayClick(event) {

        if (
            event.target !==
            event.currentTarget
        ) {

            return;

        }

        if (
            typeof onClose ===
            "function"
        ) {

            onClose();

        }

    }

    return (

        <div
            className="admin-modal-overlay"
            role="presentation"
            onMouseDown={handleOverlayClick}
        >

            <section
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-access-title"
                aria-describedby="admin-access-description"
            >

                <h2 id="admin-access-title">

                    Centro de Administración

                </h2>

                <p id="admin-access-description">

                    Ingrese el PIN de administrador.

                </p>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="admin-pin">

                        PIN administrativo

                    </label>

                    <input
                        id="admin-pin"
                        ref={inputRef}
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        value={pin}
                        placeholder="Ingrese el PIN"
                        maxLength={10}
                        aria-invalid={
                            Boolean(errorMessage)
                        }
                        aria-describedby={
                            errorMessage
                                ? "admin-access-error"
                                : undefined
                        }
                        onChange={(event) => {

                            setPin(
                                event.target.value
                            );

                        }}
                    />

                    {
                        errorMessage && (

                            <p
                                id="admin-access-error"
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
                            onClick={onClose}
                        >

                            Cancelar

                        </button>

                        <button
                            type="submit"
                            disabled={!pin.trim()}
                        >

                            Ingresar

                        </button>

                    </div>

                </form>

            </section>

        </div>

    );

}