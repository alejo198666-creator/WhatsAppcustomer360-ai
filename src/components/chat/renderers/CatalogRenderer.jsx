import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    useContext,
    useState
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
 * Permite seleccionar productos mediante botones sin que el
 * usuario tenga que escribir manualmente el identificador.
 * ===========================================================
 */

export default function CatalogRenderer({ message }) {

    const {
        addMessage
    } = useContext(ChatContext);

    const [actionExecuted, setActionExecuted] = useState(false);

    const {
        title,
        customerName,
        notice,
        products = [],
        cartCount = 0,
        cartTotal = 0
    } = message.payload ?? {};

    const formattedTotal = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(cartTotal);

    /**
     * Procesa la selección visual de un producto.
     */
    function handleSelectProduct(product) {

        if (actionExecuted) return;

        setActionExecuted(true);

        /*
         * Mensaje visible que representa la acción realizada
         * por el usuario.
         */
        const userMessage = createTextMessage(
            "user",
            `Seleccionar: ${product.nombre}`
        );

        addMessage(userMessage);

        setTimeout(() => {

            /*
             * Mensaje interno entendido por ventaFlow.
             */
            const botMessage = chatbot(
                `seleccionar_producto:${product.id}`
            );

            addMessage(botMessage);

        }, 300);

    }

    /**
     * Finaliza provisionalmente la venta.
     */
    function handleFinishSale() {

        if (actionExecuted || cartCount === 0) return;

        setActionExecuted(true);

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
                    borderRadius: 2
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
                                    disabled={actionExecuted}
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
                                actionExecuted ||
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