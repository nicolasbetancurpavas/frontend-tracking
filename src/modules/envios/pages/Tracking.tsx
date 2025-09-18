// Componente de timeline horizontal para tracking de una guía.
// Comentarios en español, código en inglés.

import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Fragment, useMemo } from "react";

export type HistoryItem = {
  estado: "asignado" | "transporte" | "entregado";
  fecha: string; // ISO
  creado_por: string | null;
  equipo_transporte: number | null;
};

type Props = {
  history: HistoryItem[]; // historial de la guía (ordenado o no)
  // locale opcional para formateo de fecha (por defecto es el del navegador)
  locale?: string;
};

// Orden oficial del ciclo (definido por negocio)
const ORDERED_STEPS: HistoryItem["estado"][] = [
  "asignado",
  "transporte",
  "entregado",
];

// Etiquetas legibles para cada estado
const LABELS: Record<HistoryItem["estado"], string> = {
  asignado: "Asignado",
  transporte: "En transporte",
  entregado: "Entregado",
};

export default function ShipmentTimeline({ history, locale }: Props) {
  // Normalizamos el historial por estado, tomando el más reciente para cada uno
  const byState = useMemo(() => {
    const map = new Map<HistoryItem["estado"], HistoryItem>();
    for (const item of history) {
      const prev = map.get(item.estado);
      if (!prev || new Date(item.fecha) > new Date(prev.fecha)) {
        map.set(item.estado, item);
      }
    }
    return map;
  }, [history]);

  // Paso activo = índice del último estado presente en el orden del ciclo
  const activeStep = useMemo(() => {
    let idx = 0;
    ORDERED_STEPS.forEach((s, i) => {
      if (byState.has(s)) idx = i;
    });
    return idx;
  }, [byState]);

  return (
    <Box>
      {/* Stepper horizontal con 3 pasos */}
      <Stepper alternativeLabel activeStep={activeStep}>
        {ORDERED_STEPS.map((state) => {
          const item = byState.get(state);
          const completed = !!item; // completado si existe en historial

          return (
            <Step key={state} completed={completed}>
              <StepLabel
                StepIconComponent={(props) =>
                  completed ? (
                    <CheckCircleOutlineIcon color="primary" />
                  ) : (
                    <RadioButtonUncheckedIcon
                      color={props.active ? "primary" : "disabled"}
                    />
                  )
                }
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {LABELS[state]}
                </Typography>

                {/* Subtítulos: fecha + metadatos */}
                <Metadata item={item} locale={locale} />
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}

// Subcomponente para renderizar fecha/usuario/equipo debajo de cada estado
function Metadata({ item, locale }: { item?: HistoryItem; locale?: string }) {
  if (!item) {
    return (
      <Typography variant="caption" color="text.disabled" display="block">
        Pendiente
      </Typography>
    );
  }

  const dt = new Date(item.fecha);
  const dateStr = dt.toLocaleString(locale);

  return (
    <Fragment>
      <Typography variant="caption" color="text.secondary" display="block">
        {dateStr}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        Actualizado por: {item.creado_por ?? "-"}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        Equipo: {item.equipo_transporte ?? "-"}
      </Typography>
    </Fragment>
  );
}
