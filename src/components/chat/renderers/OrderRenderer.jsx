/**
 * ===========================================================
 * OrderRenderer.jsx
 * -----------------------------------------------------------
 * Renderiza visualmente un pedido generado por el chatbot.
 *
 * Responsabilidades:
 *
 * - Mostrar el identificador del pedido.
 * - Mostrar la información del cliente.
 * - Listar los productos comprados.
 * - Presentar subtotal, IVA, descuento y total.
 * - Mostrar el estado y la fecha del pedido.
 *
 * El componente solamente presenta información.
 * No modifica el pedido ni el estado de la conversación.
 * ===========================================================
 */

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography
} from "@mui/material";

/**
 * Formatea valores numéricos como pesos colombianos.
 *
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {

    const numericValue = Number(value) || 0;

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(numericValue);

}

/**
 * Formatea una fecha en formato local colombiano.
 *
 * @param {string|Date|null} value
 * @returns {string}
 */
function formatDate(value) {

    if (!value) {
        return "Fecha no disponible";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);

}

/**
 * Obtiene la configuración visual correspondiente al estado
 * actual del pedido.
 *
 * @param {string} status
 * @returns {{label: string, color: string}}
 */
function getStatusConfig(status) {

    const normalizedStatus =
        String(status ?? "")
            .trim()
            .toLowerCase();

    switch (normalizedStatus) {

        case "confirmado":
        case "completado":
        case "entregado":

            return {
                label: status,
                color: "success"
            };

        case "cancelado":

            return {
                label: status,
                color: "error"
            };

        case "en proceso":
        case "procesando":

            return {
                label: status,
                color: "info"
            };

        case "pendiente":

            return {
                label: status,
                color: "warning"
            };

        default:

            return {
                label: status || "Sin estado",
                color: "default"
            };

    }

}

/**
 * Fila individual de producto.
 *
 * @param {Object} props
 * @param {Object} props.item
 */
function OrderProductRow({ item }) {

    const quantity =
        Number(item?.cantidad) || 0;

    const unitPrice =
        Number(item?.precio) || 0;

    const subtotal =
        Number(item?.subtotal) ||
        quantity * unitPrice;

    return (
        <Box
            sx={{
                py: 1.25
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
            >
                <Box sx={{ minWidth: 0 }}>

                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        {item?.nombre ?? "Producto sin nombre"}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {quantity} × {formatCurrency(unitPrice)}
                    </Typography>

                </Box>

                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                        whiteSpace: "nowrap"
                    }}
                >
                    {formatCurrency(subtotal)}
                </Typography>

            </Stack>
        </Box>
    );

}

/**
 * Fila para valores monetarios del pedido.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {boolean} props.highlight
 */
function PriceRow({
    label,
    value,
    highlight = false
}) {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
        >
            <Typography
                variant={
                    highlight
                        ? "subtitle1"
                        : "body2"
                }
                color={
                    highlight
                        ? "text.primary"
                        : "text.secondary"
                }
                fontWeight={
                    highlight
                        ? 700
                        : 400
                }
            >
                {label}
            </Typography>

            <Typography
                variant={
                    highlight
                        ? "subtitle1"
                        : "body2"
                }
                fontWeight={
                    highlight
                        ? 700
                        : 500
                }
            >
                {formatCurrency(value)}
            </Typography>
        </Stack>
    );

}

/**
 * Renderizador principal del pedido.
 *
 * @param {Object} props
 * @param {Object} props.message
 */
export default function OrderRenderer({ message }) {

    const order =
        message?.payload ?? {};

    const products =
        Array.isArray(order.productos)
            ? order.productos
            : [];

    const customer =
        order.cliente ?? {};

    const statusConfig =
        getStatusConfig(order.estado);

    return (
        <Card
            variant="outlined"
            sx={{
                width: "100%",
                maxWidth: 460,
                borderRadius: 3,
                overflow: "hidden"
            }}
        >
            {/* Encabezado del pedido */}
            <Box
                sx={{
                    px: 2,
                    py: 1.75,
                    bgcolor: "success.main",
                    color: "success.contrastText"
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography
                        component="span"
                        aria-hidden="true"
                        sx={{
                            fontSize: 24,
                            lineHeight: 1,
                            fontWeight: 700
                        }}
                    >
                        ✓
                    </Typography>

                    <Box>

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            Pedido generado
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                opacity: 0.9
                            }}
                        >
                            La venta fue registrada correctamente
                        </Typography>

                    </Box>
                </Stack>
            </Box>

            <CardContent>

                <Stack spacing={2}>

                    {/* Identificación y estado */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography
                                component="span"
                                aria-hidden="true"
                                sx={{
                                    fontSize: 20,
                                    lineHeight: 1
                                }}
                            >
                                🧾
                            </Typography>

                            <Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Número de pedido
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    {order.id ?? "Sin identificador"}
                                </Typography>

                            </Box>
                        </Stack>

                        <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Divider />

                    {/* Información del cliente */}
                    <Stack
                        direction="row"
                        spacing={1.25}
                        alignItems="flex-start"
                    >
                        <Typography
                            component="span"
                            aria-hidden="true"
                            sx={{
                                fontSize: 20,
                                lineHeight: 1
                            }}
                        >
                            👤
                        </Typography>

                        <Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Cliente
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {
                                    customer.nombre ??
                                    "Cliente no disponible"
                                }
                            </Typography>

                            {customer.telefono && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    {customer.telefono}
                                </Typography>
                            )}

                        </Box>
                    </Stack>

                    <Divider />

                    {/* Productos */}
                    <Box>

                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{
                                mb: 0.5
                            }}
                        >
                            Productos
                        </Typography>

                        {products.length > 0 ? (

                            <Stack
                                divider={
                                    <Divider flexItem />
                                }
                            >
                                {products.map(
                                    (item, index) => (

                                        <OrderProductRow
                                            key={
                                                item.productoId ??
                                                item.id ??
                                                `${item.nombre}-${index}`
                                            }
                                            item={item}
                                        />

                                    )
                                )}
                            </Stack>

                        ) : (

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                El pedido no contiene productos.
                            </Typography>

                        )}

                    </Box>

                    <Divider />

                    {/* Valores monetarios */}
                    <Stack spacing={0.75}>

                        <PriceRow
                            label="Subtotal"
                            value={order.subtotal}
                        />

                        <PriceRow
                            label="IVA"
                            value={order.iva}
                        />

                        <PriceRow
                            label="Descuento"
                            value={order.descuento}
                        />

                        <Divider sx={{ my: 0.5 }} />

                        <PriceRow
                            label="Total"
                            value={order.total}
                            highlight
                        />

                    </Stack>

                    {/* Fecha de creación */}
                    <Typography
						variant="caption"
						color="text.secondary"
						sx={{
							textAlign: "right"
						}}
					>
						Generado: {
							formatDate(order.fechaCreacion)
						}
					</Typography>

                </Stack>

            </CardContent>
        </Card>
    );

}