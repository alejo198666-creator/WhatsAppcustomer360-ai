import { Box } from "@mui/material";
import Message from "./Message";

import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../contexts/ChatContext";

export default function ChatBody() {

    const { messages } = useContext(ChatContext);

    const bottomRef = useRef(null);

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

                <Message
                    key={message.id}
                    text={message.payload.text}
					bot={message.sender === "bot"}
                />

            ))}

            <div ref={bottomRef}></div>

        </Box>

    );

}