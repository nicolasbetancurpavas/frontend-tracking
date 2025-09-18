import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { IAsignacionGuia } from "../../../shared/api/interfaces";
import { generationCheckpoint } from "../services/shipmentService";
import { isAxiosError } from "axios";

type Props = {
  open: boolean;
  onClose: () => void;
  guia: string;
  usuarioId: string | null;
  onAssigned: () => Promise<void>;
  generarCheckpoint?: boolean; // 👈 NUEVA PROP
};

type FieldErrors = Partial<Record<keyof IAsignacionGuia | "general", string>>;

const ESTADOS = ["transporte", "entregado"]; // puedes ajustarlos

function parseValidationErrors(
  details: { field: string; message: string }[]
): FieldErrors {
  return details.reduce((acc, { field, message }) => {
    acc[field as keyof IAsignacionGuia] = message;
    return acc;
  }, {} as FieldErrors);
}

export default function AssignCheckpointModal({
  open,
  onClose,
  guia,
  usuarioId,
  onAssigned,
  generarCheckpoint = false,
}: Props) {
  const [equipo, setEquipo] = useState<string>("");
  const [fecha, setFecha] = useState<string>(new Date().toISOString());
  const [estado, setEstado] = useState<
    "sin_asignar" | "asignado" | "transporte" | "entregado"
  >("asignado");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (open) {
      setEquipo("");
      setFecha(new Date().toISOString());
      setError(null);
      setSubmitting(false);
      setFieldErrors({});
      setEstado("asignado");
    }
  }, [open]);

  const disabled =
    !guia || !usuarioId || submitting || (generarCheckpoint && !estado);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setFieldErrors({});

      const dto: IAsignacionGuia = {
        guia,
        estado,
        fecha,
        usuario_id: usuarioId!,
      };

      const equipoTrim = equipo.trim();
      if (equipoTrim) {
        dto.equipo_transporte = equipoTrim;
      }

      await generationCheckpoint(dto);
      await onAssigned();
      setOk(true);
      onClose();
    } catch (e: any) {
      if (isAxiosError(e)) {
        const status = e.response?.status;
        const data = e.response?.data;

        if (status === 422 && Array.isArray(data?.details)) {
          const parsed = parseValidationErrors(data.details);
          setFieldErrors(parsed);
          setError(parsed.general ?? "Datos inválidos.");
        } else {
          setError(data?.message ?? "Error inesperado");
        }
      } else {
        setError("Error de red o inesperado");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          {generarCheckpoint ? "Generar checkpoint" : "Asignar transportista"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Guía"
              value={guia}
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Usuario (UUID)"
              value={usuarioId ?? ""}
              size="small"
              disabled
            />

            {generarCheckpoint ? (
              <FormControl size="small">
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  value={estado}
                  label="Estado"
                  onChange={(e) => setEstado(e.target.value)}
                  error={!!fieldErrors.estado}
                >
                  {ESTADOS.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Equipo transporte"
                value={equipo}
                onChange={(e) => setEquipo(e.target.value)}
                size="small"
                helperText={
                  fieldErrors.equipo_transporte ??
                  "Solo se envía si lo diligencias (asignación)."
                }
                error={!!fieldErrors.equipo_transporte}
              />
            )}

            <TextField
              label="Fecha (ISO)"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              helperText={fieldErrors.fecha ?? "Ej: 2025-09-17T10:30:00Z"}
              error={!!fieldErrors.fecha}
              size="small"
            />

            {error && (
              <div style={{ color: "#c62828", fontSize: 13 }}>{error}</div>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="contained" disabled={disabled} onClick={onSubmit}>
            {submitting ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={ok} autoHideDuration={2500} onClose={() => setOk(false)}>
        <Alert severity="success" variant="filled" onClose={() => setOk(false)}>
          Checkpoint generado correctamente.
        </Alert>
      </Snackbar>
    </>
  );
}
