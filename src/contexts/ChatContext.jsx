import { createContext, useState } from "react";

export const ChatContext = createContext();

/**
 * ===========================================================
 * ChatProvider
 * -----------------------------------------------------------
 * Administra el estado global del chat.
 *
 * Todos los mensajes del sistema siguen un modelo unificado,
 * permitiendo renderizar diferentes tipos de contenido:
 *
 * - Texto
 * - Catálogos
 * - Carritos
 * - Pedidos
 * - Botones
 * * En futuras versiones:
 * - Imágenes
 * - Mapas
 * - PDF
 * ===========================================================
 */

export default function ChatProvider({ children }) {

    const [messages, setMessages] = useState([]);

    /**
     * Agrega un mensaje al historial.
     *
     * @param {Object} message
     */
    const addMessage = (message) => {

        setMessages(previous => [

            ...previous,

            message

        ]);

    };

    /**
     * Limpia completamente la conversación.
     */
    const clearChat = () => {

        setMessages([]);

    };

    const value = {

        messages,

        setMessages,

        addMessage,

        clearChat

    };

    return (

        <ChatContext.Provider value={value}>

            {children}

        </ChatContext.Provider>

    );

}