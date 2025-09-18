// src/modules/envios/pages/CrearAsignar.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function CreateAsig() {
  const { pathname } = useLocation();
  const isCrear = pathname.endsWith("/crear");
  const titulo = isCrear ? "Crear envío (HU2)" : "Asignar transportista (HU3)";
  const subtitulo = isCrear
    ? "Formulario placeholder para creación de guía."
    : "Pantalla placeholder para asignación a transportista y ruta.";

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitulo}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
