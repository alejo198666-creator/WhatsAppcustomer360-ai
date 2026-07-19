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

    const [

        text,

        setText

    ] = useState("");

    function sendMessage() {

        if (text.trim() === "") return;

        //--------------------------------------------------
        // Mensaje del usuario
        //--------------------------------------------------

        const userMessage = createMessage({

            sender: "user",

            payload: {

                text

            }

        });

        addMessage(userMessage);

        setText("");

        //--------------------------------------------------
        // Respuesta del bot
        //--------------------------------------------------

        setTimeout(() => {

            const response = chatbot(text);

            const botMessage = createMessage({

                sender: "bot",

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

                onChange={(e) => setText(e.target.value)}

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        sendMessage();

                    }

                }}

            />

            <Button

                variant="contained"

                onClick={sendMessage}

            >

                Enviar

            </Button>

        </Box>

    );

}