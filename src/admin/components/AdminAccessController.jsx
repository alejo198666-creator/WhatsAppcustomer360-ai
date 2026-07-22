/**
 * ===========================================================
 * AdminAccessController.jsx
 * -----------------------------------------------------------
 * Controlador del acceso al Centro de Administración.
 *
 * Responsabilidades:
 *
 * - escuchar el atajo administrativo;
 * - abrir y cerrar el modal;
 * - recibir el PIN ingresado;
 * - validar temporalmente el acceso;
 * - notificar al componente superior cuando el acceso
 *   sea autorizado.
 *
 * El PIN fijo se utiliza únicamente durante esta fase local.
 * Posteriormente será reemplazado por autenticación real.
 * ===========================================================
 */

import {
    useCallback,
    useState
} from "react";

import AdminAccessModal from "./AdminAccessModal.jsx";

import {
    useAdminShortcut
} from "../hooks/useAdminShortcut.js";

/**
 * PIN administrativo temporal.
 *
 * No representa seguridad real porque el código se ejecuta
 * en el navegador y puede ser inspeccionado.
 */
const TEMPORARY_ADMIN_PIN = "1234";

/**
 * Controla el acceso al módulo administrativo.
 *
 * @param {Object} props
 * @param {Function} props.onAccessGranted
 * Función ejecutada cuando el PIN es correcto.
 */
export default function AdminAccessController({
    onAccessGranted
}) {

    const [
        isModalOpen,
        setIsModalOpen
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage
    ] = useState("");

    /**
     * Abre el modal y limpia cualquier error anterior.
     */
    const openModal = useCallback(() => {

        setErrorMessage("");
        setIsModalOpen(true);

    }, []);

    /**
     * Cierra el modal y limpia el mensaje de error.
     */
    const closeModal = useCallback(() => {

        setErrorMessage("");
        setIsModalOpen(false);

    }, []);

    /*
     * Escucha:
     *
     * Windows/Linux: Ctrl + Shift + A
     * macOS: Command + Shift + A
     */
    useAdminShortcut({
        onActivate: openModal,
        enabled: !isModalOpen
    });

    /**
     * Procesa el PIN enviado desde el modal.
     *
     * @param {string} enteredPin
     */
    function handleSubmit(enteredPin) {

        const normalizedPin =
            String(enteredPin ?? "").trim();

        if (!normalizedPin) {

            setErrorMessage(
                "Debe ingresar el PIN de administrador."
            );

            return;

        }

        if (
            normalizedPin !==
            TEMPORARY_ADMIN_PIN
        ) {

            setErrorMessage(
                "El PIN ingresado no es correcto."
            );

            return;

        }

        setErrorMessage("");
        setIsModalOpen(false);

        if (
            typeof onAccessGranted ===
            "function"
        ) {

            onAccessGranted();

        }

    }

    return (

        <AdminAccessModal
            isOpen={isModalOpen}
            errorMessage={errorMessage}
            onClose={closeModal}
            onSubmit={handleSubmit}
        />

    );

}