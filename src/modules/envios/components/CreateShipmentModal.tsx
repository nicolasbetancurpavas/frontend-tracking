// src/modules/envios/components/CreateShipmentModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { isAxiosError } from "axios";
import { parseJoiErrors } from "../../../shared/api/errros";
import type { CreateShipmentDTO } from "../../../shared/api/interfaces";
import { createShipment } from "../services/shipmentService";

type FieldErrs = Partial<Record<keyof CreateShipmentDTO | "general", string>>;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  userId: string | null;
}

// Opciones de tipo de paquete (valores en snake_case → así se envían al backend)
const TIPOS_PAQUETE = [
  { value: "caja_mediana", label: "Caja mediana" },
  { value: "paquete_pequeno", label: "Paquete pequeño" },
  { value: "paquete_mediano", label: "Paquete mediano" },
  { value: "paquete_grande", label: "Paquete grande" },
  // Agrega más si los usas:
  // { value: "sobre", label: "Sobre" },
  // { value: "caja_pequena", label: "Caja pequeña" },
  // { value: "caja_grande", label: "Caja grande" },
  // { value: "otro", label: "Otro" },
];

export default function CreateShipmentModal({
  open,
  onClose,
  onCreated,
  userId,
}: Props) {
  const [form, setForm] = useState<CreateShipmentDTO>({
    guia: "",
    peso_kg: 0,
    largo_cm: 0,
    ancho_cm: 0,
    alto_cm: 0,
    tipo_paquete: "",
    descripcion_producto: "",
    id_direccion_destino: 0,
    creado_por: userId ?? "",
  });
  const [errs, setErrs] = useState<FieldErrs>({});
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    setForm((s) => ({ ...s, creado_por: userId ?? "" }));
  }, [userId]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numeric = [
      "peso_kg",
      "largo_cm",
      "ancho_cm",
      "alto_cm",
      "id_direccion_destino",
    ];
    setForm((s) => ({
      ...s,
      [name]: numeric.includes(name) ? Number(value) : value,
    }));
    setErrs((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrs({});
    setErrMsg(null);
    try {
      // Validación mínima en front: exigir tipo_paquete
      if (!form.tipo_paquete) {
        setErrs((p) => ({ ...p, tipo_paquete: "Selecciona un tipo." }));
        setLoading(false);
        return;
      }

      const payload: CreateShipmentDTO = {
        ...form,
        guia: form.guia.trim(),
        // tipo_paquete ya está en snake_case desde el select
        descripcion_producto: form.descripcion_producto?.trim() || undefined,
      };
      await createShipment(payload);
      setOk(true);
      onCreated?.();
      onClose();
      // Reset del formulario
      setForm((s) => ({
        ...s,
        guia: "",
        peso_kg: 0,
        largo_cm: 0,
        ancho_cm: 0,
        alto_cm: 0,
        tipo_paquete: "",
        descripcion_producto: "",
        id_direccion_destino: 0,
      }));
    } catch (error: any) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        if (status === 422) {
          const fe = parseJoiErrors(data);
          setErrs(fe as FieldErrs);
          const hasFieldErrs = Object.keys(fe).some((k) => k !== "general");
          setErrMsg(hasFieldErrs ? null : (fe.general ?? "Datos inválidos."));
        } else {
          setErrMsg(String(data?.message ?? "No se pudo crear la guía."));
        }
      } else {
        setErrMsg("No se pudo crear la guía. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={onSubmit} noValidate>
          <DialogTitle>Crear guía</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Guía (11 dígitos)"
                name="guia"
                value={form.guia}
                onChange={onChange}
                error={!!errs.guia}
                helperText={errs.guia}
                size="small"
                inputProps={{
                  maxLength: 11,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Peso (kg)"
                  name="peso_kg"
                  type="number"
                  value={form.peso_kg}
                  onChange={onChange}
                  error={!!errs.peso_kg}
                  helperText={errs.peso_kg}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Largo (cm)"
                  name="largo_cm"
                  type="number"
                  value={form.largo_cm}
                  onChange={onChange}
                  error={!!errs.largo_cm}
                  helperText={errs.largo_cm}
                  size="small"
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Ancho (cm)"
                  name="ancho_cm"
                  type="number"
                  value={form.ancho_cm}
                  onChange={onChange}
                  error={!!errs.ancho_cm}
                  helperText={errs.ancho_cm}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Alto (cm)"
                  name="alto_cm"
                  type="number"
                  value={form.alto_cm}
                  onChange={onChange}
                  error={!!errs.alto_cm}
                  helperText={errs.alto_cm}
                  size="small"
                  fullWidth
                />
              </Stack>

              <TextField
                label="Tipo de paquete"
                name="tipo_paquete"
                select
                value={form.tipo_paquete as unknown as string}
                onChange={onChange}
                error={!!errs.tipo_paquete}
                helperText={errs.tipo_paquete}
                size="small"
                required
              >
                <MenuItem value="" disabled>
                  Selecciona un tipo…
                </MenuItem>
                {TIPOS_PAQUETE.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Descripción del producto (opcional)"
                name="descripcion_producto"
                value={form.descripcion_producto ?? ""}
                onChange={onChange}
                error={!!errs.descripcion_producto}
                helperText={errs.descripcion_producto}
                size="small"
                multiline
                minRows={2}
              />

              <TextField
                label="ID dirección destino"
                name="id_direccion_destino"
                type="number"
                value={form.id_direccion_destino}
                onChange={onChange}
                error={!!errs.id_direccion_destino}
                helperText={errs.id_direccion_destino}
                size="small"
              />

              <TextField
                label="Creado por (UUID)"
                name="creado_por"
                value={form.creado_por}
                onChange={onChange}
                error={!!errs.creado_por}
                helperText={errs.creado_por ?? "Se toma de tu sesión"}
                size="small"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                loading || !form.creado_por || !form.tipo_paquete // no permitir si no eligieron tipo
              }
            >
              {loading ? "Creando..." : "Crear guía"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={ok} autoHideDuration={2200} onClose={() => setOk(false)}>
        <Alert severity="success" variant="filled" onClose={() => setOk(false)}>
          Guía creada correctamente.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errMsg}
        autoHideDuration={4000}
        onClose={() => setErrMsg(null)}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrMsg(null)}
        >
          {errMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
