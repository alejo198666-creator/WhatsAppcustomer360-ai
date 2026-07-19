import {
    Box,
    Typography
} from "@mui/material";

/**
 * ===========================================================
 * Message
 * -----------------------------------------------------------
 * Componente visual para una burbuja de texto.
 *
 * No conoce el modelo completo del mensaje.
 * Solo recibe:
 *
 * - text: contenido que debe mostrar.
 * - bot: indica si pertenece al bot.
 *
 * El componente TextRenderer se encarga de transformar
 * el modelo de mensaje en estas propiedades.
 * ===========================================================
 */

export default function Message({ text, bot }) {

    return (

        <Box
            sx={{
                display: "flex",

                // Mensajes del bot a la izquierda.
                // Mensajes del usuario a la derecha.
                justifyContent: bot
                    ? "flex-start"
                    : "flex-end",

                marginBottom: 1.5
            }}
        >

            <Box
                sx={{
                    maxWidth: "75%",
                    paddingX: 1.5,
                    paddingY: 1,
                    borderRadius: 2,

                    // Color similar a WhatsApp.
                    backgroundColor: bot
                        ? "#FFFFFF"
                        : "#D9FDD3",

                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)"
                }}
            >

                <Typography
                    variant="body2"
                    sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.5,
                        overflowWrap: "anywhere"
                    }}
                >

                    {text}

                </Typography>

            </Box>

        </Box>

    );

}