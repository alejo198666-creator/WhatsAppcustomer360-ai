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
    createMessage
} from "../../models/MessageModel";

export default function ChatInput() {

    const {
        addMessage
    } = useContext(ChatContext);

    const [text, setText] = useState("");

    function sendMessage() {

        const messageText = text.trim();

        // Evita enviar mensajes vacíos.
        if (messageText === "") return;

        //--------------------------------------------------
        // Mensaje del usuario
        //--------------------------------------------------

        const userMessage = createMessage({
            sender: "user",
            type: "text",
            payload: {
                text: messageText
            }
        });

        addMessage(userMessage);

        // Limpia el campo de entrada.
        setText("");

        //--------------------------------------------------
        // Respuesta del bot
        //--------------------------------------------------

        setTimeout(() => {

            const response = chatbot(messageText);

            const botMessage = createMessage({
                sender: "bot",
                type: "text",
                payload: {
                    text: response
                }
            });

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
                onChange={(event) => setText(event.target.value)}
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