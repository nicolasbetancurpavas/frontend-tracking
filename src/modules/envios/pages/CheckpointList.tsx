import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tooltip,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../auth/store/auth.store";
import AssignCheckpointModal from "../components/AssignCheckpointModal";
import type { GuideCheckpointHistory } from "../../../shared/api/interfaces";
import { getHistoricShipments } from "../services/shipmentService";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
export default function HistoricShipments() {
  // color de acento
  const navigate = useNavigate();
  const colorPrimary = "#4990e7ff";

  // sesión/rol
  const role = useAuthStore((s) => s.user?.role) as string | undefined;
  const userId = useAuthStore((s) => s.user?.id ?? null) as string | null;
  const isAdmin = role === "admin";

  // estado local
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GuideCheckpointHistory[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // modal
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>("");

  // cargar datos
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await getHistoricShipments();
      setItems(data);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "No se pudo cargar la lista");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Título */}
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <IconButton
          aria-label="Volver"
          onClick={() => navigate(-1)}
          sx={{ color: colorPrimary, p: 0, mr: 2 }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 400, color: colorPrimary }}>
          Histórico de Guías
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Encabezados de las columnas del estado actual */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              px: 2,
              py: 1,
              mb: 1,
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            <Typography sx={{ flex: 1.7, fontWeight: 400 }}>Guía</Typography>
            <Typography sx={{ flex: 1, fontWeight: 400, mr: 2 }}>
              Estado actual
            </Typography>
            <Typography sx={{ flex: 2, fontWeight: 400 }}>
              Último cambio
            </Typography>
            <Typography sx={{ flex: 1, fontWeight: 400 }}>Acción</Typography>
          </Box>

          {/* Error (si aplica) */}
          {err && (
            <Typography color="error" sx={{ mb: 2 }}>
              {err}
            </Typography>
          )}

          {/* Lista de guías */}
          {items.map((r) => (
            <Accordion key={r.guia} disableGutters sx={{ mr: 7 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {/* Fila "visual" alineada a los encabezados de arriba */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  width="100%"
                >
                  <Typography
                    sx={{ flex: 2, fontWeight: 400, color: colorPrimary }}
                  >
                    {r.guia}
                  </Typography>

                  {/* Estado actual */}
                  <Box sx={{ flex: 1 }}>
                    <Chip
                      label={r.estado_actual}
                      color={
                        r.estado_actual === "entregado" ? "success" : "info"
                      }
                      size="small"
                    />
                  </Box>

                  {/* Último cambio */}
                  <Typography variant="body2" sx={{ flex: 2 }}>
                    {new Date(r.fecha_ultimo_cambio).toLocaleString()}
                  </Typography>

                  {/* Acción */}
                  <Box sx={{ flex: 1, textAlign: { sm: "right" } }}>
                    {isAdmin && (
                      <Tooltip title="Generar un nuevo checkpoint">
                        <span>
                          <Button
                            disabled={
                              r.estado_actual === "entregado" ? true : false
                            }
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedGuide(r.guia);
                              setOpenAssign(true);
                            }}
                          >
                            Checkpoint
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                  </Box>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                {/* Encabezado de sección */}
                <Typography variant="subtitle2" sx={{ fontWeight: 400, mb: 1 }}>
                  Histórico de Checkpoints
                </Typography>
                <Divider sx={{ mb: 1 }} />

                {/* Tabla del histórico */}
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 400 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 400 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 400 }}>Creado por</TableCell>
                      <TableCell sx={{ fontWeight: 400 }}>
                        Equipo Transporte
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {r.historico.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell>{h.estado}</TableCell>
                        <TableCell>
                          {new Date(h.fecha).toLocaleString()}
                        </TableCell>
                        <TableCell>{h.creado_por ?? "-"}</TableCell>
                        <TableCell>{h.equipo_transporte ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Modal para generar checkpoint */}
      <AssignCheckpointModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        guia={selectedGuide}
        usuarioId={userId}
        generarCheckpoint={true}
        onAssigned={async () => {
          await fetchList();
        }}
      />
    </Box>
  );
}
