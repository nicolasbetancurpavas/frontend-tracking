// src/pages/PanelEnvios.tsx
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import RouteIcon from "@mui/icons-material/AltRoute";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/auth.store";

export default function PanelEnvios() {
  const navigate = useNavigate();
  // Si tu tipo de rol solo tiene 'admin' | 'user' hoy, lo tratamos como string para soportar 'transportista' sin romper TS
  const role = useAuthStore((s) => s.user?.role) as unknown as
    | string
    | undefined;

  const isAdmin = role === "admin";
  const isTransportista = role === "transport";
  const canAssign = isAdmin; // solo admin
  const canCheckpoint = isAdmin || isTransportista; // admin o transportista

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Stack alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 400, color: " #4d5265ff" }}>
          Panel de Operaciones
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        <Grid container spacing={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <Header
              icon={<LocalShippingIcon fontSize="large" />}
              title="Crear guías & Asignar"
              subtitle="Registra nuevas guías y asígnalas a un transportista y ruta."
              gradient="linear-gradient(135deg, #4990e7ff 0%, #478ed1 100%)"
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • La creación de guías está disponible para usuarios
                autenticados.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • La asignación de transportistas es exclusiva para
                administradores.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Listado de guias creadas
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
              <Tooltip
                title={
                  canAssign
                    ? "Asignar guía a transportista y ruta"
                    : "Requiere rol admin"
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    startIcon={
                      !canAssign ? <LockOutlinedIcon /> : <AssignmentIndIcon />
                    }
                    onClick={() => navigate("/envios/crear")}
                    disabled={!canAssign}
                  >
                    Crear envios y asignar
                  </Button>
                </span>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>

        {/* Card 2: Generación de checkpoints */}
        <Grid container spacing={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <Header
              icon={<RouteIcon fontSize="large" />}
              title="Generación de checkpoints"
              subtitle="Registra eventos: salida de transporte, entrega o pérdida."
              gradient="linear-gradient(135deg, #66bb6a 0%, #43a047 100%)"
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • Disponible para transportistas y administradores.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Cada acción queda auditada y actualiza el estado de la guía.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Historico de guias
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Tooltip
                title={
                  canCheckpoint
                    ? "Registrar checkpoint"
                    : "Requiere rol transport o admin"
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/historico/envios")}
                    disabled={!canCheckpoint}
                  >
                    Registrar checkpoint
                  </Button>
                </span>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>

        {/* Card 3: Tracking */}
        <Grid container spacing={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <Header
              icon={<TrackChangesIcon fontSize="large" />}
              title="Tracking"
              subtitle="Consulta el estado e historial de tus envíos en tiempo real."
              gradient="linear-gradient(135deg, #df6575ff 0%, #df6575ff 100%)"
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • Disponible para todos los usuarios autenticados.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Actualización automática mediante polling.
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/historico")}
              >
                Ver tracking
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function Header({
  icon,
  title,
  subtitle,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        color: "white",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        background: gradient,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
