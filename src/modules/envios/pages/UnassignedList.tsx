// src/modules/envios/pages/UnassignedList.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Skeleton,
  LinearProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../auth/store/auth.store";
import { useNavigate } from "react-router-dom";
import type { ShipmentListItem } from "../../../shared/api/interfaces";
import { getshipments } from "../services/shipmentService";
import CreateShipmentModal from "../components/CreateShipmentModal";
import AssignCheckpointModal from "../components/AssignCheckpointModal";

export default function UnassignedList() {
  const colorPrimary = "#4990e7ff";
  const navigate = useNavigate();

  const role = useAuthStore((s) => s.user?.role) as string | undefined;
  const userId = useAuthStore((s) => s.user?.id ?? null) as string | null;

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ShipmentListItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  // 👇 estado para el modal de asignación
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>("");

  const fetchList = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setErr(null);
        const guiaParam = query.trim()
          ? query.trim().replace(/^'+|'+$/g, "")
          : undefined;
        const data = await getshipments(guiaParam);
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? "No se pudo cargar la lista");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [setItems]
  );

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      if (alive) fetchList(q);
    }, 350);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q, fetchList]);

  const maxHeight = 56 + 6 * 60;
  const rows = Array.isArray(items) ? items : [];

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton width={120} />
      </TableCell>
      <TableCell>
        <Skeleton width={100} />
      </TableCell>
      <TableCell>
        <Skeleton width={80} />
      </TableCell>
      <TableCell>
        <Skeleton width={160} />
      </TableCell>
      <TableCell>
        <Skeleton width={140} />
      </TableCell>
      <TableCell>
        <Skeleton width={180} />
      </TableCell>
      <TableCell align="center">
        <Skeleton variant="circular" width={28} height={28} />
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: "1rem" }}>
        <Chip
          sx={{ background: "#f2bf09ff", color: "#ffffffff", fontWeight: 500 }}
          label={`Rol: ${role ?? "sin sesión"}`}
          size="small"
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <IconButton
          aria-label="Volver"
          onClick={() => navigate(-1)}
          sx={{ color: colorPrimary, p: 0 }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 400, color: colorPrimary }}>
          Paquetes sin asignación
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          CREAR PAQUETE
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por guía..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Box
            sx={{
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 1.5,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                maxHeight,
                overflowY: rows.length > 6 ? "auto" : "visible",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Guía</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>Peso (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      Dimensiones (L×A×H)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      Ciudad destino
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      Fecha creación
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }} align="center">
                      Acción
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonRow key={`sk-${i}`} />
                      ))
                    : rows.map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell
                            sx={{ fontWeight: 500, color: colorPrimary }}
                          >
                            {r.guia ?? ""}
                          </TableCell>
                          <TableCell>
                            {(r.tipo_paquete ?? "").replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>{r.peso_kg ?? ""}</TableCell>
                          <TableCell>
                            {r.largo_cm ?? ""}
                            {r.largo_cm != null ? "×" : ""}
                            {r.ancho_cm ?? ""}
                            {r.ancho_cm != null ? "×" : ""}
                            {r.alto_cm ?? ""}
                          </TableCell>
                          <TableCell>{r.destino_ciudad ?? ""}</TableCell>
                          <TableCell>
                            {r.fecha_creacion
                              ? new Date(r.fecha_creacion).toLocaleString()
                              : ""}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Generar un nuevo checkpoint">
                              <span>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    setSelectedGuide(r.guia);
                                    setOpenAssign(true);
                                  }}
                                >
                                  asig
                                </Button>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ py: 6, color: "text.secondary" }}
                      >
                        {err ?? "No hay paquetes sin asignar."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de creación */}
      <CreateShipmentModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        userId={userId}
        onCreated={() => {
          void fetchList(q);
        }}
      />

      {/* Modal de asignación (checkpoint asignado) */}
      <AssignCheckpointModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        guia={selectedGuide}
        usuarioId={userId}
        onAssigned={async () => {
          await fetchList(q); // refrescar lista después de asignar
        }}
      />
    </Box>
  );
}
