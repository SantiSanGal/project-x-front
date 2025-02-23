import { GrupoPixeles, postGrupoPixeles } from "@/core/actions/canvas";
import { ImageUp, Loader, ZoomIn, ZoomOut } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Point, Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PixelSelectorProps {
  coors: { x: number; y: number };
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PixelSelector = ({
  coors,
  openModal,
  setOpenModal,
}: PixelSelectorProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(5); // Comenzamos con un zoom más alto
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: async (grupo_pixeles: GrupoPixeles) => {
      const respuesta = await postGrupoPixeles(grupo_pixeles);
      return respuesta;
    },
    onSuccess: () => {
      setCropModalOpen(false);
      setOpenModal(false);
      toast.success("Colores enviados correctamente");
    },
    onError: () => {
      toast.error("Hubo un error al procesar los colores");
    }
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setCrop({ x: 0, y: 0 });
      setZoom(5);

      if (fileRejections.length > 0) {
        toast.error("El archivo no es de tipo imagen");
        return;
      }

      const file = acceptedFiles[0];
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 2000, // Aumentamos el tamaño máximo para mejor resolución
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);

        // Precargamos la imagen para obtener sus dimensiones
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          imgRef.current = img;
        };
        img.src = imageUrl;

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
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const image = imgRef.current;

    // Configuramos el canvas para una representación exacta de píxeles
    canvas.width = 5;
    canvas.height = 5;

    // Desactivamos el suavizado para obtener píxeles exactos
    ctx.imageSmoothingEnabled = false;

    // Calculamos las coordenadas exactas de píxeles
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const exactX = Math.floor(croppedAreaPixels.x * scaleX);
    const exactY = Math.floor(croppedAreaPixels.y * scaleY);
    const exactWidth = Math.floor(croppedAreaPixels.width * scaleX);
    const exactHeight = Math.floor(croppedAreaPixels.height * scaleY);

    // Dibujamos la sección exacta de 5x5 píxeles
    ctx.drawImage(image, exactX, exactY, exactWidth, exactHeight, 0, 0, 5, 5);

    // Extraemos los colores exactos
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

    mutate(grupo_pixeles_params);
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-white text-base">
              Select Area and Extract{" "}
              <span className="text-lime-600">Pixels</span>
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
            <>
              <div className="relative h-80 mt-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  minZoom={1}
                  maxZoom={100} // Aumentamos el zoom máximo
                  cropSize={{ width: 100, height: 100 }} // Tamaño fijo del área de crop
                  onMediaLoaded={(mediaSize) => {
                    const img = new Image();
                    img.src = imageSrc;
                    img.onload = () => {
                      imgRef.current = img;
                      setImageSize({ width: img.width, height: img.height });
                    };
                  }}
                />
              </div>

              <div className="flex items-center gap-4 mt-4">
                <ZoomOut className="size-4" />
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={1}
                  max={100}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="size-4" />
              </div>
            </>
          )}

          {colors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">
                Preview de píxeles exactos:
              </p>
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
