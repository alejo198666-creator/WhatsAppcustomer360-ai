import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack
} from "@mui/material";

/**
 * ===========================================================
 * ProductCard
 * -----------------------------------------------------------
 * Tarjeta visual para representar un producto del catálogo.
 * ===========================================================
 */

export default function ProductCard({
    product,
    onSelect,
    disabled = false
}) {

    /**
     * Formatea valores monetarios como pesos colombianos.
     */
    const formattedPrice = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(product.precio);

    return (

        <Card
            variant="outlined"
            sx={{
                minWidth: 190,
                maxWidth: 220,
                flex: "0 0 auto",
                borderRadius: 2
            }}
        >

            <CardContent>

                <Stack spacing={1.5}>

                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                    >
                        {product.nombre}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="primary"
                        fontWeight={700}
                    >
                        {formattedPrice}
                    </Typography>

                    <Button
                        variant="contained"
                        size="small"
                        disabled={disabled}
                        onClick={() => onSelect(product)}
                    >
                        Seleccionar
                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}