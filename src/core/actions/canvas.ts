import { millionApi } from "@/api/million.api";

export const getCanvasPixeles = async () => {
  try {
    const { data } = await millionApi.get("canvas");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPixelesOcupados = async (idSector: number) => {
  try {
    const { data } = await millionApi.get(`/canvas/rangosOcupados/${idSector}`);
    return data;
  } catch (error) {
    throw error;
  }
};
