import { logApi } from "../../../shared/api/api";
import type {
  CreateShipmentDTO,
  GuideCheckpointHistory,
  IAsignacionGuia,
  ShipmentListItem,
} from "../../../shared/api/interfaces";
import type { HistoryItem } from "../pages/Tracking";

export async function getshipments(guia?: string): Promise<ShipmentListItem[]> {
  const url = guia
    ? `/shipments?guia=${encodeURIComponent(guia)}`
    : `/shipments`;
  const data = await logApi.get(url);
  return data.data.data as ShipmentListItem[];
}

export async function getHistoricShipments(): Promise<
  GuideCheckpointHistory[]
> {
  const data = await logApi.get("/historic/shipments");
  return data.data.data as GuideCheckpointHistory[];
}

export async function createShipment(dto: CreateShipmentDTO) {
  const { data } = await logApi.post("/create", dto);
  return data?.data ?? data;
}

export async function generationCheckpoint(dto: IAsignacionGuia) {
  const { data } = await logApi.post("/checkpoint", dto);
  return data?.data ?? data;
}

export async function getGuideHistoryByGuia(guia: string) {
  const { data } = await logApi.get(`/historic?guia=${guia}`);
  return data.data as HistoryItem[];
}
