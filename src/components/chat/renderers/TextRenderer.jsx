import Message from "../Message";

/**
 * ===========================================================
 * TextRenderer
 * -----------------------------------------------------------
 * Renderiza mensajes de tipo "text".
 *
 * Recibe el mensaje completo y extrae:
 *
 * - payload.text
 * - sender
 *
 * Esta separación permite agregar posteriormente otros
 * renderizadores sin modificar el componente Message.
 * ===========================================================
 */

export default function TextRenderer({ message }) {

    // Evita errores si el mensaje no contiene texto.
    const text = message?.payload?.text ?? "";

    // Determina si el mensaje pertenece al bot.
    const bot = message?.sender === "bot";

    return (
        <Message
            text={text}
            bot={bot}
        />
    );

}