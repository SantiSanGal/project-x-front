import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Callback que se dispara al confirmar el crop.
   * Devuelve un objeto con:
   * - coors: coordenadas (x,y) del área recortada (top-left en la imagen original)
   * - colors: un array de 25 colores (hexadecimales) extraídos del área recortada escalada a 5×5
   */
  onConfirm: (data: {
    coors: { x: number; y: number };
    colors: string[];
  }) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Manejamos el input file para que el usuario suba su imagen
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixelsValue: any) => {
      setCroppedAreaPixels(croppedAreaPixelsValue);
    },
    []
  );

  // Calcula si el crop es "válido": que el área en la imagen original sea 5x5 (dentro de una tolerancia)
  const isCropValid =
    croppedAreaPixels &&
    Math.abs(croppedAreaPixels.width - 5) < 0.5 &&
    Math.abs(croppedAreaPixels.height - 5) < 0.5;

  // Extrae los colores del área recortada
  const getCroppedColors = async (): Promise<{
    colors: string[];
    coors: { x: number; y: number };
  } | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;
    // Creamos un canvas offscreen de 5x5
    const canvas = document.createElement("canvas");
    canvas.width = 5;
    canvas.height = 5;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    // Para asegurarnos de que no se suavice, desactivamos el smoothing
    ctx.imageSmoothingEnabled = false;
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    // Dibujamos la porción exacta (sin escalado adicional, ya que queremos 5x5)
    // Aquí asumimos que croppedAreaPixels ya es 5x5 (de lo contrario, el botón estará deshabilitado)
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      5,
      5
    );
    const imageData = ctx.getImageData(0, 0, 5, 5).data;
    const newColors: string[] = [];
    for (let i = 0; i < 25; i++) {
      const offset = i * 4;
      const r = imageData[offset];
      const g = imageData[offset + 1];
      const b = imageData[offset + 2];
      const hex =
        "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      newColors.push(hex);
    }
    // Las coordenadas del área recortada (top-left) en la imagen original
    return {
      colors: newColors,
      coors: {
        x: Math.floor(croppedAreaPixels.x),
        y: Math.floor(croppedAreaPixels.y),
      },
    };
  };

  const handleConfirmCrop = async () => {
    const result = await getCroppedColors();
    if (result) {
      onConfirm(result);
    }
    onOpenChange(false);
  };

  // Opcional: si el modal se cierra, limpiamos el estado
  useEffect(() => {
    if (!open) {
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a 5×5 area</DialogTitle>
        </DialogHeader>
        {/* Si no hay imagen, mostramos el input file */}
        {!imageSrc && (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}
        {/* Si hay imagen, mostramos el cropper */}
        {imageSrc && (
          <div className="relative w-full h-80">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              // Puedes ajustar el contenedor del cropper según tus necesidades
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmCrop} disabled={!isCropValid}>
            {isCropValid ? "Add Image" : "Zoom in until 5×5"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
