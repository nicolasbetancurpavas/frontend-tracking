import {
  Box,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { HistoryItem } from "../pages/Tracking";

type Props = {
  history: HistoryItem[];
};

// orden real de estados
const ORDER = [
  "asignado",
  "transporte",
  "entregado",
  "arribado",
  "descargado",
  "finalizado",
] as const;

const LABELS: Record<string, string> = {
  asignado: "Asignado",
  transporte: "En tránsito",
  entregado: "Entregado",
  arribado: "Arribado",
  descargado: "Descargado",
  finalizado: "Finalizado",
};

export default function ShipmentTimeline({ history }: Props) {
  const estados = history.map((h) => h.estado);
  const activeIndex = ORDER.findIndex((e) =>
    estados.includes(e as "asignado" | "entregado" | "transporte")
  );

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Stepper alternativeLabel activeStep={activeIndex}>
        {ORDER.map((estado) => {
          const data = history.find((h) => h.estado === estado);
          const isCompleted = !!data;
          return (
            <Step key={estado} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() =>
                  isCompleted ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" />
                  )
                }
              >
                <Stack spacing={0.5} alignItems="center">
                  <Typography variant="body2">{LABELS[estado]}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data ? new Date(data.fecha).toLocaleString() : "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data?.creado_por ?? ""}
                  </Typography>
                </Stack>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
