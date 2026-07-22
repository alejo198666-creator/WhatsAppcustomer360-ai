import TextRenderer from "./TextRenderer";
import CatalogRenderer from "./CatalogRenderer";
import OrderRenderer from "./OrderRenderer";
import OrdersListRenderer from "./OrdersListRenderer";

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
 * - order
 * - orders
 * ===========================================================
 */

export default function MessageRenderer({ message }) {

    /*
     * Protección ante mensajes inexistentes.
     */
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

        case "order":

            return (
                <OrderRenderer message={message} />
            );

        case "orders":

            return (
                <OrdersListRenderer message={message} />
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