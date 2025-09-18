import {
  Box,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useState, useMemo, useEffect } from "react";
import { getGuideHistoryByGuia } from "../services/shipmentService"; // ajusta si cambia el path

type Estado = "asignado" | "transporte" | "entregado";

export type HistoryItem = {
  estado: Estado;
  fecha: string;
  creado_por: string | null;
  equipo_transporte: number | null;
};

const ORDER: Estado[] = ["asignado", "transporte", "entregado"];

const LABELS: Record<Estado, string> = {
  asignado: "Asignado",
  transporte: "En tránsito",
  entregado: "Entregado",
};

export default function TrackingPage() {
  const [guia, setGuia] = useState("");
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false); // detecta si ya intentó buscar

  const isValidGuia = /^[0-9]{11}$/.test(guia);

  const fetchHistorial = async () => {
    if (!isValidGuia) return;
    setTouched(true);
    try {
      const res = await getGuideHistoryByGuia(guia);
      console.log("data", res);
      const data = res ?? [];
      console.log("ss", data);
      if (!data.length) {
        setHistory(null);
        setError("No hay información para esta guía");
      } else {
        setHistory(data);
        setError(null);
      }
    } catch (err) {
      setHistory(null);
      setError("No hay información para esta guía");
    }
  };

  // Limpia error si cambia el input
  useEffect(() => {
    setError(null);
  }, [guia]);

  const byState = useMemo(() => {
    const map = new Map<Estado, HistoryItem>();
    history?.forEach((item) => {
      const prev = map.get(item.estado);
      if (!prev || new Date(item.fecha) > new Date(prev.fecha)) {
        map.set(item.estado, item);
      }
    });
    return map;
  }, [history]);

  const activeStep = useMemo(() => {
    let idx = -1;
    ORDER.forEach((estado, i) => {
      if (byState.has(estado)) idx = i;
    });
    return idx;
  }, [byState]);

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <TextField
        label="Buscar por número de guía"
        value={guia}
        onChange={(e) => setGuia(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchHistorial()}
        fullWidth
        margin="normal"
        inputProps={{
          maxLength: 11,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        error={guia.length > 0 && !isValidGuia}
        helperText={
          guia && !isValidGuia
            ? "Debe contener exactamente 11 dígitos"
            : "Presiona Enter para buscar"
        }
      />

      {/* Mensaje de error si no hay info */}
      {touched && error && (
        <Typography mt={4} color="error" align="center">
          {error}
        </Typography>
      )}

      {/* Stepper siempre visible (inicial o con datos) */}
      <Paper elevation={3} sx={{ mt: 2, p: 3 }}>
        <Stepper alternativeLabel activeStep={activeStep}>
          {ORDER.map((estado) => {
            const item = byState.get(estado);
            const completed = !!item;

            return (
              <Step key={estado} completed={completed}>
                <StepLabel
                  StepIconComponent={() =>
                    completed ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <RadioButtonUncheckedIcon color="disabled" />
                    )
                  }
                >
                  <Typography variant="body2" fontWeight={600}>
                    {LABELS[estado]}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {item ? new Date(item.fecha).toLocaleString() : "Pendiente"}
                  </Typography>

                  {item?.creado_por && (
                    <Typography variant="caption" color="text.secondary">
                      {`Actualizado por: ${item.creado_por}`}
                    </Typography>
                  )}

                  {item?.equipo_transporte && (
                    <Typography variant="caption" color="text.secondary">
                      {`Equipo: ${item.equipo_transporte}`}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Paper>
    </Box>
  );
}
