import {
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    useContext
} from "react";

import {
    ChatContext
} from "../../../contexts/ChatContext";

import {
    chatbot
} from "../../../services/chatbot";

import {
    createTextMessage
} from "../../../models/MessageModel";

/**
 * ===========================================================
 * OrdersListRenderer
 * -----------------------------------------------------------
 * Renderiza una lista interactiva de pedidos pertenecientes
 * a un cliente.
 *
 * Cada pedido muestra:
 *
 * - Número del pedido.
 * - Fecha de creación.
 * - Estado.
 * - Total.
 * - Botón para consultar el detalle.
 *
 * Al pulsar "Ver detalle", se envía un comando interno al
 * chatbot para reutilizar el flujo de consulta de pedidos.
 * ===========================================================
 */

export default function OrdersListRenderer({ message }) {

    const {
        addMessage,
        updateMessage
    } = useContext(ChatContext);

    const {
        title = "📦 Mis pedidos",
        customer = null,
        orders = [],
        isInteractive = true
    } = message.payload ?? {};

    const actionsDisabled =
        !isInteractive;

    /**
     * Formatea valores en pesos colombianos.
     *
     * @param {number} value
     * @returns {string}
     */
    function formatCurrency(value) {

        const numericValue =
            Number(value) || 0;

        return new Intl.NumberFormat(
            "es-CO",
            {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            }
        ).format(numericValue);

    }

    /**
     * Formatea una fecha para mostrarla en español.
     *
     * Los pedidos recuperados de localStorage pueden contener
     * fechas representadas como texto.
     *
     * @param {Date|string} value
     * @returns {string}
     */
    function formatDate(value) {

        if (!value) {

            return "Fecha no disponible";

        }

        const date =
            new Date(value);

        if (Number.isNaN(date.getTime())) {

            return "Fecha no disponible";

        }

        return new Intl.DateTimeFormat(
            "es-CO",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);

    }

    /**
     * Devuelve el color visual del estado del pedido.
     *
     * @param {string} status
     * @returns {string}
     */
    function getStatusColor(status) {

        const normalizedStatus =
            String(status ?? "")
                .trim()
                .toLowerCase();

        switch (normalizedStatus) {

            case "entregado":
                return "success";

            case "cancelado":
                return "error";

            case "en preparación":
            case "en preparacion":
                return "warning";

            case "enviado":
                return "info";

            default:
                return "default";

        }

    }

    /**
     * Deshabilita los botones del mensaje actual.
     *
     * Esto evita ejecutar repetidamente acciones desde un
     * mensaje antiguo del historial.
     */
    function disableCurrentList() {

        updateMessage(
            message.id,
            (currentMessage) => ({
                ...currentMessage,

                payload: {
                    ...currentMessage.payload,
                    isInteractive: false
                }
            })
        );

    }

    /**
     * Solicita el detalle de un pedido.
     *
     * @param {Object} order
     */
    function handleViewOrder(order) {

        if (
            actionsDisabled ||
            !order?.id
        ) {

            return;

        }

        disableCurrentList();

        /*
         * Mostramos en el historial la acción realizada por
         * el usuario.
         */
        const userMessage =
            createTextMessage(
                "user",
                `Ver pedido: ${order.id}`
            );

        addMessage(userMessage);

        setTimeout(() => {

            /*
             * El comando interno será procesado por chatbot.js.
             * En el siguiente paso conectaremos esta instrucción
             * con pedidoFlow.js.
             */
            const botMessage =
                chatbot(
                    `consultar_pedido:${order.id}`
                );

            addMessage(botMessage);

        }, 300);

    }

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 2
            }}
        >

            <Paper
                elevation={1}
                sx={{
                    width: "100%",
                    maxWidth: 760,
                    padding: 2,
                    borderRadius: 2,
                    opacity: actionsDisabled
                        ? 0.75
                        : 1,
                    transition: "opacity 0.2s ease"
                }}
            >

                <Stack spacing={1.5}>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    {customer && (

                        <Box>

                            <Typography variant="body2">

                                Cliente:{" "}

                                <strong>
                                    {customer.nombre}
                                </strong>

                            </Typography>

                            {customer.telefono && (

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    WhatsApp: {customer.telefono}
                                </Typography>

                            )}

                        </Box>

                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {orders.length} pedido(s) encontrado(s)
                    </Typography>

                    {actionsDisabled && (

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Esta lista ya fue utilizada.
                        </Typography>

                    )}

                    <Divider />

                    {orders.length === 0 ? (

                        <Typography variant="body2">

                            No hay pedidos registrados para este cliente.

                        </Typography>

                    ) : (

                        <Stack spacing={1.5}>

                            {orders.map((order) => (

                                <Paper
                                    key={order.id}
                                    variant="outlined"
                                    sx={{
                                        padding: 1.5,
                                        borderRadius: 2
                                    }}
                                >

                                    <Stack spacing={1.25}>

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row"
                                            }}
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems={{
                                                xs: "flex-start",
                                                sm: "center"
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                >
                                                    {order.id}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {formatDate(
                                                        order.fechaCreacion
                                                    )}
                                                </Typography>

                                            </Box>

                                            <Chip
                                                label={
                                                    order.estado ??
                                                    "Sin estado"
                                                }
                                                color={getStatusColor(
                                                    order.estado
                                                )}
                                                size="small"
                                            />

                                        </Stack>

                                        <Divider />

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row"
                                            }}
                                            spacing={1}
                                            justifyContent="space-between"
                                            alignItems={{
                                                xs: "stretch",
                                                sm: "center"
                                            }}
                                        >

                                            <Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Total
                                                </Typography>

                                                <Typography
                                                    variant="body1"
                                                    fontWeight={700}
                                                >
                                                    {formatCurrency(
                                                        order.total
                                                    )}
                                                </Typography>

                                            </Box>

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled={actionsDisabled}
                                                onClick={() =>
                                                    handleViewOrder(order)
                                                }
                                            >
                                                Ver detalle
                                            </Button>

                                        </Stack>

                                    </Stack>

                                </Paper>

                            ))}

                        </Stack>

                    )}

                </Stack>

            </Paper>

        </Box>

    );

}