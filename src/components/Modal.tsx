import { DialogTitle } from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

interface ModalProps {
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

export const Modal = (
    { openModal, setOpenModal, coors,
        // onConfirm
    }: ModalProps) => {
    // Inicializamos un array de 25 colores (para un grid 5x5), por defecto blanco.
    const [colors, setColors] = useState<string[]>(Array(25).fill("#ffffff"));

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
            pixeles: [] as Array<{ coordenada_x: number; coordenada_y: number; color: string }>,
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

        // Se llama al callback con el objeto armado.
        // onConfirm(grupo_pixeles_params);
        // Cerramos el modal
        setOpenModal(false);
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Your Pixels: Colors & Positions</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                    {/* Grid 5x5 */}
                    <div className="grid grid-cols-5">
                        {Array.from({ length: 25 }).map((_, index) => (
                            <Popover key={index}>
                                <PopoverTrigger
                                    className="h-10 w-10 border hover:border-slate-400"
                                    style={{ backgroundColor: colors[index] }}
                                >
                                    {/* Puedes agregar contenido adicional aquí si lo deseas */}
                                </PopoverTrigger>
                                <PopoverContent className="w-fit">
                                    <input
                                        type="color"
                                        value={colors[index]}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                    />
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>
                    {/* Botón para confirmar */}
                    <button
                        onClick={handleConfirm}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
