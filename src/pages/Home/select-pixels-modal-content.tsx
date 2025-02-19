import { GrupoPixeles, postGrupoPixeles } from "@/core/actions/canvas";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Modal } from "@/components/Modal";
import { Loader } from "lucide-react";
import { useState } from "react";

interface SelectPixelsModalContentProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  /** Coordenadas iniciales del grupo de pixeles en el canvas */
  coors: { x: number; y: number };
  /**
   * Callback para enviar el objeto a confirmar.
   * Recibe un objeto con la siguiente forma:
   * {
   *   grupo_pixeles: { link: string, coordenada_x_inicio: number, coordenada_y_inicio: number, coordenada_x_fin: number, coordenada_y_fin: number },
   *   pixeles: Array<{ coordenada_x: number, coordenada_y: number, color: string }>
   * }
   */
  // onConfirm: (data: any) => void;
}

export const SelectPixelsModalContent = ({
  openModal,
  setOpenModal,
  coors,
}: SelectPixelsModalContentProps) => {
  // Inicializamos un array de 25 colores (para un grid 5x5), por defecto blanco.
  const [colors, setColors] = useState<string[]>(Array(25).fill("#ffffff"));

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: GrupoPixeles) => {
      const response = await postGrupoPixeles(data);
      return response
    }
  })

  // Actualiza el color en la posición indicada.
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  // Al confirmar, se arma el objeto JSON a enviar.
  const handleConfirm = () => {
    const grupo_pixeles_params = {
      grupo_pixeles: {
        link: "http://validarstring.com",
        coordenada_x_inicio: coors.x,
        coordenada_y_inicio: coors.y,
        // Suponemos que el grupo es de 5 pixeles de ancho y alto:
        coordenada_x_fin: coors.x + 4,
        coordenada_y_fin: coors.y + 4,
      },
      pixeles: [] as Array<{
        coordenada_x: number;
        coordenada_y: number;
        color: string;
      }>,
    };

    // Recorremos cada celda (índice 0 a 24) y calculamos su posición.
    for (let index = 0; index < 25; index++) {
      const row = Math.floor(index / 5);
      const col = index % 5;
      grupo_pixeles_params.pixeles.push({
        coordenada_x: coors.x + col,
        coordenada_y: coors.y + row,
        color: colors[index],
      });
    }

    // Aquí llamarías al callback onConfirm si lo necesitas.
    // onConfirm(grupo_pixeles_params);
    // Cerramos el modal
    mutate(grupo_pixeles_params);
    // setOpenModal(false);
  };

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal}>
      <DialogHeader>
        <DialogTitle className="text-white text-base">
          Customize Your <span className="text-lime-600">Pixels</span>, Colors &
          Positions
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-5 gap-0">
          {Array.from({ length: 25 }).map((_, index) => (
            <input
              key={index}
              type="color"
              className="h-10 w-10 m-0 p-0 border border-slate-400"
              value={colors[index]}
              onChange={(e) => handleColorChange(index, e.target.value)}
            />
          ))}
        </div>

        <button
          disabled={isPending}
          onClick={handleConfirm}
          className="mt-4 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded transition-colors"
        >
          {
            isPending ? <Loader className="size-6 animate-spin" /> : <>Confirm</>
          }
        </button>
      </div>
    </Modal>
  );
};
