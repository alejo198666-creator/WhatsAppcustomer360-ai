import TextRenderer from "./TextRenderer";

/**
 * ===========================================================
 * MessageRenderer
 * -----------------------------------------------------------
 * Componente encargado de seleccionar cómo debe mostrarse
 * cada mensaje según su propiedad "type".
 *
 * Tipos previstos:
 *
 * - text
 * - catalog
 * - buttons
 * - cart
 * - order
 * - image
 * - map
 * - pdf
 *
 * Actualmente solo está implementado el tipo "text".
 * Los demás se incorporarán progresivamente.
 * ===========================================================
 */

export default function MessageRenderer({ message }) {

    // Protección ante mensajes inválidos.
    if (!message) {

        return null;

    }

    switch (message.type) {

        case "text":

            return (
                <TextRenderer message={message} />
            );

        default:

            /*
             * Si aparece un tipo de mensaje que todavía no tiene
             * renderizador, se intenta mostrar como texto.
             *
             * Esto evita que toda la interfaz falle mientras
             * agregamos nuevos tipos de mensajes.
             */
            return (
                <TextRenderer message={message} />
            );

    }

}