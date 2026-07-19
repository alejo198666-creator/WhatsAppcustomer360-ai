import { Box } from "@mui/material";

import {
    useContext,
    useEffect,
    useRef
} from "react";

import {
    ChatContext
} from "../../contexts/ChatContext";

import MessageRenderer from "./renderers/MessageRenderer";

/**
 * ===========================================================
 * ChatBody
 * -----------------------------------------------------------
 * Contenedor principal del historial de conversación.
 *
 * Responsabilidades:
 *
 * - Obtener los mensajes desde ChatContext.
 * - Recorrer el historial.
 * - Delegar el renderizado a MessageRenderer.
 * - Desplazar automáticamente el chat hacia el último mensaje.
 * ===========================================================
 */

export default function ChatBody() {

    const {
        messages
    } = useContext(ChatContext);

    const bottomRef = useRef(null);

    /**
     * Cada vez que cambia el arreglo de mensajes,
     * desplazamos el contenido hacia el último mensaje.
     */
    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    return (

        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
                background: "#ECE5DD"
            }}
        >

            {messages.map((message) => (

                <MessageRenderer
                    key={message.id}
                    message={message}
                />

            ))}

            {/* Punto de referencia para el desplazamiento automático */}
            <div ref={bottomRef} />

        </Box>

    );

}