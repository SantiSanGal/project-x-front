import React, { useCallback, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Point, Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { ImageUp, Loader } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PixelSelectorProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  coors: { x: number; y: number };
  onConfirm: (data: any) => void;
}

export const PixelSelector = ({
  openModal,
  setOpenModal,
  coors,
  onConfirm,
}: PixelSelectorProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      if (fileRejections.length > 0) {
        toast.error("El archivo no es de tipo imagen");
        return;
      }

      const file = acceptedFiles[0];
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImageSrc(imageUrl);
        setCropModalOpen(true);
      } catch (error) {
        toast.error("Hubo un problema al procesar la imagen");
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const extractPixelColors = async (croppedAreaPixels: Area) => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = imgRef.current;

    // Set canvas size to exactly 5x5 pixels
    canvas.width = 5;
    canvas.height = 5;

    // Calculate scaling factors
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Draw the selected area to our 5x5 canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      5,
      5
    );

    // Extract colors from each pixel
    const pixelColors: string[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${[pixel[0], pixel[1], pixel[2]]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;
        pixelColors.push(color);
      }
    }

    return pixelColors;
  };

  const onCropComplete = useCallback(
    async (croppedArea: Area, croppedAreaPixels: Area) => {
      const colors = await extractPixelColors(croppedAreaPixels);
      if (colors) {
        setColors(colors);
      }
    },
    []
  );

  const handleConfirm = async () => {
    if (!colors.length) return;

    setIsPending(true);

    const grupo_pixeles_params = {
      grupo_pixeles: {
        link: imageSrc || "http://validarstring.com",
        coordenada_x_inicio: coors.x,
        coordenada_y_inicio: coors.y,
        coordenada_x_fin: coors.x + 4,
        coordenada_y_fin: coors.y + 4,
      },
      pixeles: colors.map((color, index) => ({
        coordenada_x: coors.x + (index % 5),
        coordenada_y: coors.y + Math.floor(index / 5),
        color: color,
      })),
    };

    try {
      await onConfirm(grupo_pixeles_params);
      setCropModalOpen(false);
      setOpenModal(false);
      // toast.success("Colores extraídos correctamente");
    } catch (error) {
      // toast.error("Hubo un error al procesar los colores");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              Select Area and Extract{" "}
              <span className="text-lime-600">Colors</span>
            </DialogTitle>
          </DialogHeader>

          <div
            {...getRootProps()}
            className="cursor-pointer text-center p-4 border-2 border-dashed rounded-lg"
          >
            <input {...getInputProps()} />
            <ImageUp className="mx-auto mb-2" />
            <p>Drag and drop an image here, or click to select one</p>
          </div>

          {imageSrc && cropModalOpen && (
            <div className="relative h-80 mt-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(mediaSize) => {
                  const img = new Image();
                  img.src = imageSrc;
                  img.onload = () => {
                    imgRef.current = img;
                  };
                }}
              />
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-5 gap-0 w-fit mx-auto">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={!colors.length || isPending}
              onClick={handleConfirm}
              className="bg-lime-600 hover:bg-lime-700"
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};
