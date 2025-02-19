import { millionApi } from "@/api/million.api";

//Para componente GestionCompra
export interface IndividualPixel {
  coordenada_x: number;
  coordenada_y: number;
  color: string;
}

export interface GrupoPixeles {
  grupo_pixeles: {
    link: string;
    coordenada_x_inicio: number;
    coordenada_y_inicio: number;
    coordenada_x_fin: number;
    coordenada_y_fin: number;
  };
  pixeles: IndividualPixel[];
}

export const getCanvasPixeles = async () => {
  try {
    const { data } = await millionApi.get("canvas");
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getPixelesOcupados = async (idSector: number) => {
  try {
    const { data } = await millionApi.get(`/canvas/rangosOcupados/${idSector}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const postGrupoPixeles = async (data: GrupoPixeles) => {
  try {
    const response = await millionApi.post('', data);
    return response
  } catch (error) {
    throw error;
  }
}
