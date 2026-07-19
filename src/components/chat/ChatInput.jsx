import {
    Box,
    TextField,
    Button
} from "@mui/material";

import {
    useState,
    useContext
} from "react";

import {
    ChatContext
} from "../../contexts/ChatContext";

import {
    chatbot
} from "../../services/chatbot";

import {
    createTextMessage
} from "../../models/MessageModel";

/**
 * ===========================================================
 * ChatInput
 * -----------------------------------------------------------
 * Captura los mensajes escritos por el usuario.
 *
 * Responsabilidades:
 *
 * - Validar la entrada.
 * - Crear el mensaje del usuario.
 * - Enviarlo al contexto.
 * - Solicitar una respuesta al chatbot.
 * - Agregar la respuesta estructurada al historial.
 * ===========================================================
 */

export default function ChatInput() {

    const {
        addMessage
    } = useContext(ChatContext);

    const [text, setText] = useState("");

    /**
     * Envía el mensaje escrito por el usuario.
     */
    function sendMessage() {

        const messageText = text.trim();

        // Evita mensajes vacíos.
        if (messageText === "") return;

        //--------------------------------------------------
        // Crear mensaje del usuario
        //--------------------------------------------------

        const userMessage = createTextMessage(
            "user",
            messageText
        );

        addMessage(userMessage);

        // Limpiar inmediatamente el campo.
        setText("");

        //--------------------------------------------------
        // Procesar respuesta del chatbot
        //--------------------------------------------------

        setTimeout(() => {

            /*
             * chatbot() ya devuelve un objeto MessageModel.
             *
             * No es necesario volver a llamar createMessage().
             */
            const botMessage = chatbot(messageText);


            addMessage(botMessage);

        }, 500);

    }

    return (

        <Box
            sx={{
                display: "flex",
                gap: 1,
                padding: 2
            }}
        >

            <TextField
                fullWidth
                size="small"
                value={text}
                placeholder="Escribe un mensaje..."
                onChange={(event) => {

                    setText(event.target.value);

                }}
                onKeyDown={(event) => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        sendMessage();

                    }

                }}
            />

            <Button
                variant="contained"
                onClick={sendMessage}
                disabled={text.trim() === ""}
            >
                Enviar
            </Button>

        </Box>

    );

}