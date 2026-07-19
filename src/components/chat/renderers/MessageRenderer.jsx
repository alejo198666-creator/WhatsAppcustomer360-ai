import TextRenderer from "./TextRenderer";
import CatalogRenderer from "./CatalogRenderer";

/**
 * ===========================================================
 * MessageRenderer
 * -----------------------------------------------------------
 * Selecciona el componente visual correspondiente según el
 * tipo de mensaje recibido.
 *
 * Tipos implementados:
 *
 * - text
 * - catalog
 * ===========================================================
 */

export default function MessageRenderer({ message }) {

    // Protección ante mensajes inexistentes.
    if (!message) {

        return null;

    }

    switch (message.type) {

        case "text":

            return (
                <TextRenderer message={message} />
            );

        case "catalog":

            return (
                <CatalogRenderer message={message} />
            );

        default:

            /*
             * Un tipo desconocido no debe romper el historial.
             */
            return (
                <TextRenderer
                    message={{
                        ...message,
                        payload: {
                            text: "No se pudo mostrar este tipo de mensaje."
                        }
                    }}
                />
            );

    }

}