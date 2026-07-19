import {
    Box,
    Button,
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

import ProductCard from "../ProductCard";

/**
 * ===========================================================
 * CatalogRenderer
 * -----------------------------------------------------------
 * Renderiza mensajes de tipo "catalog".
 *
 * Cuando el usuario selecciona un producto o finaliza la
 * venta, el catálogo se actualiza y sus botones quedan
 * deshabilitados.
 *
 * Esto impide ejecutar varias veces una acción desde un
 * mensaje antiguo del historial.
 * ===========================================================
 */
export default function CatalogRenderer({ message }) {

    const {
        addMessage,
        updateMessage
    } = useContext(ChatContext);

    const {
        title,
        customerName,
        notice,
        products = [],
        cartCount = 0,
        cartTotal = 0,
        isInteractive = true
    } = message.payload ?? {};

    /**
     * Determina si las acciones del catálogo deben estar
     * deshabilitadas.
     */
    const actionsDisabled = !isInteractive;

    /**
     * Formatea el total como moneda colombiana.
     */
    const formattedTotal = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(cartTotal);

    /**
     * Desactiva permanentemente las acciones del catálogo.
     */
    function disableCurrentCatalog() {

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
     * Procesa la selección visual de un producto.
     *
     * @param {Object} product
     */
    function handleSelectProduct(product) {

        if (actionsDisabled || !product) return;

        /*
         * Primero desactivamos el catálogo actual para evitar
         * dobles clics o selecciones repetidas.
         */
        disableCurrentCatalog();

        /*
         * Agregamos una representación visible de la acción
         * realizada por el usuario.
         */
        const userMessage = createTextMessage(
            "user",
            `Seleccionar: ${product.nombre}`
        );

        addMessage(userMessage);

        setTimeout(() => {

            /*
             * Este comando interno no se muestra directamente.
             * Es interpretado por ventaFlow.
             */
            const botMessage = chatbot(
                `seleccionar_producto:${product.id}`
            );

            addMessage(botMessage);

        }, 300);

    }

    /**
     * Procesa la finalización de la venta.
     */
    function handleFinishSale() {

        if (
            actionsDisabled ||
            cartCount === 0
        ) {

            return;

        }

        disableCurrentCatalog();

        const userMessage = createTextMessage(
            "user",
            "Finalizar venta"
        );

        addMessage(userMessage);

        setTimeout(() => {

            const botMessage = chatbot("finalizar_venta");

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

                    /*
                     * Un catálogo antiguo se muestra ligeramente
                     * atenuado para señalar que ya fue utilizado.
                     */
                    opacity: actionsDisabled ? 0.72 : 1,
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

                    {customerName && (

                        <Typography variant="body2">

                            Cliente:{" "}

                            <strong>
                                {customerName}
                            </strong>

                        </Typography>

                    )}

                    {notice && (

                        <Typography
                            variant="body2"
                            color="success.main"
                        >
                            {notice}
                        </Typography>

                    )}

                    {actionsDisabled && (

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Este catálogo ya fue utilizado.
                        </Typography>

                    )}

                    <Divider />

                    {products.length === 0 ? (

                        <Typography variant="body2">

                            No hay productos disponibles.

                        </Typography>

                    ) : (

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1.5,
                                overflowX: "auto",
                                paddingBottom: 1
                            }}
                        >

                            {products.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    disabled={actionsDisabled}
                                    onSelect={handleSelectProduct}
                                />

                            ))}

                        </Box>

                    )}

                    <Divider />

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={1}
                        alignItems={{
                            xs: "stretch",
                            sm: "center"
                        }}
                        justifyContent="space-between"
                    >

                        <Box>

                            <Typography variant="body2">

                                Productos en carrito:{" "}

                                <strong>
                                    {cartCount}
                                </strong>

                            </Typography>

                            <Typography variant="body2">

                                Total:{" "}

                                <strong>
                                    {formattedTotal}
                                </strong>

                            </Typography>

                        </Box>

                        <Button
                            variant="contained"
                            color="success"
                            disabled={
                                actionsDisabled ||
                                cartCount === 0
                            }
                            onClick={handleFinishSale}
                        >
                            Finalizar venta
                        </Button>

                    </Stack>

                </Stack>

            </Paper>

        </Box>

    );

}