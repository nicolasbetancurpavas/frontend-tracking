import { Box, Divider, Stack, Typography } from "@mui/material";
import googleLogo from "../../assets/gmail.png";
import appleLogo from "../../assets/logotipo-de-apple.png";
import facebookLogo from "../../assets/facebook.png";

type CircleProps = {
  src: string;
  alt: string;
  bg?: string;
  borderColor?: string;
};

type SocialDecorProps = {
  label?: string;
  mt?: number | string;
};
function Circle({ src, alt, bg, borderColor }: CircleProps) {
  return (
    <Box
      aria-hidden
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        bgcolor: bg ?? "transparent",
        border: borderColor ? `1px solid ${borderColor}` : "none",
        display: "grid",
        placeItems: "center",
        boxShadow: bg ? "0 1px 3px rgba(16,24,40,.1)" : "none",
      }}
    >
      <Box component="img" src={src} alt={alt} sx={{ width: 22, height: 22 }} />
    </Box>
  );
}

export default function SocialDecor({
  label = "O Continuar con",
  mt = 3,
}: SocialDecorProps) {
  return (
    <Box sx={{ mt }}>
      <Divider sx={{ "&::before, &::after": { borderColor: "grey.300" } }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Divider>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Circle src={googleLogo} alt="Google" />
        <Circle src={appleLogo} alt="Apple" />
        <Circle src={facebookLogo} alt="Facebook" />
      </Stack>
    </Box>
  );
}
