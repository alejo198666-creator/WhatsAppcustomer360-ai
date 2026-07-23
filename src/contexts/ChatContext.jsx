import {
    createContext,
    useCallback,
    useMemo,
    useState
} from "react";

/**
 * Contexto global del historial de conversación.
 */
export const ChatContext = createContext(null);

/**
 * ===========================================================
 * ChatProvider
 * -----------------------------------------------------------
 * Administra los mensajes mostrados en el chat.
 *
 * Operaciones disponibles:
 *
 * - addMessage: agrega un mensaje.
 * - updateMessage: modifica un mensaje existente.
 * - removeMessage: elimina un mensaje.
 * - clearChat: limpia todo el historial.
 * ===========================================================
 */
export default function ChatProvider({ children }) {

    const [messages, setMessages] = useState([]);

    /**
     * Agrega un mensaje al final del historial.
     *
     * @param {Object} message
     */
    /**
 * Agrega uno o varios mensajes al final del historial.
 *
 * @param {Object|Object[]} messageOrMessages
 */
const addMessage = useCallback((messageOrMessages) => {

    /*
     * Convierte siempre la respuesta en un arreglo.
     *
     * Si llega un solo mensaje:
     * { id, sender, type, payload }
     *
     * se convierte en:
     * [{ id, sender, type, payload }]
     *
     * Si ya llega un arreglo, se conserva.
     */
    const receivedMessages =
        Array.isArray(messageOrMessages)
            ? messageOrMessages
            : [messageOrMessages];

    /*
     * Conserva únicamente los mensajes válidos.
     */
    const validMessages = receivedMessages.filter((message) => {

        if (!message?.id) {

            console.error(
                "No se pudo agregar el mensaje: estructura inválida.",
                message
            );

            return false;

        }

        return true;

    });

    /*
     * Si ninguno de los mensajes es válido,
     * no se modifica el historial.
     */
    if (validMessages.length === 0) {

        return;

    }

    /*
     * Agrega todos los mensajes válidos al historial.
     */
    setMessages((previousMessages) => [
        ...previousMessages,
        ...validMessages
    ]);

}, []);

    /**
     * Actualiza un mensaje por su identificador.
     *
     * El segundo parámetro puede ser:
     *
     * 1. Un objeto con las propiedades que deben cambiar.
     * 2. Una función que recibe el mensaje actual y devuelve
     *    el nuevo mensaje.
     *
     * Ejemplo con objeto:
     *
     * updateMessage(id, {
     *     payload: nuevoPayload
     * });
     *
     * Ejemplo con función:
     *
     * updateMessage(id, currentMessage => ({
     *     ...currentMessage,
     *     payload: {
     *         ...currentMessage.payload,
     *         disabled: true
     *     }
     * }));
     *
     * @param {string} messageId
     * @param {Object|Function} update
     */
    const updateMessage = useCallback((messageId, update) => {

        if (!messageId) return;

        setMessages((previousMessages) => {

            return previousMessages.map((message) => {

                if (message.id !== messageId) {

                    return message;

                }

                /*
                 * Permite actualizaciones mediante una función.
                 */
                if (typeof update === "function") {

                    const updatedMessage = update(message);

                    return {
                        ...updatedMessage,
                        id: message.id,
                        updatedAt: new Date()
                    };

                }

                /*
                 * Permite actualizaciones mediante un objeto.
                 */
                return {
                    ...message,
                    ...update,
                    id: message.id,
                    updatedAt: new Date()
                };

            });

        });

    }, []);

    /**
     * Elimina un mensaje específico.
     *
     * @param {string} messageId
     */
    const removeMessage = useCallback((messageId) => {

        if (!messageId) return;

        setMessages((previousMessages) => {

            return previousMessages.filter(
                (message) => message.id !== messageId
            );

        });

    }, []);

    /**
     * Limpia completamente el historial del chat.
     */
    const clearChat = useCallback(() => {

        setMessages([]);

    }, []);

    /**
     * useMemo evita reconstruir innecesariamente el objeto
     * entregado por el contexto.
     */
    const value = useMemo(() => ({
        messages,
        setMessages,
        addMessage,
        updateMessage,
        removeMessage,
        clearChat
    }), [
        messages,
        addMessage,
        updateMessage,
        removeMessage,
        clearChat
    ]);

    return (

        <ChatContext.Provider value={value}>

            {children}

        </ChatContext.Provider>

    );

}