import { Box, Typography } from "@mui/material";

export default function Message({ text, bot }) {
  return (
    <Box
      display="flex"
      justifyContent={bot ? "flex-start" : "flex-end"}
      sx={{
        mt: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: bot ? "#FFFFFF" : "#D9FDD3",
          padding: "12px 16px",
          borderRadius: "16px",
          maxWidth: "72%",
          boxShadow: 2,
          wordBreak: "break-word",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            fontSize: "15px",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}