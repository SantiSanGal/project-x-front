import { GrupoPixeles, postGrupoPixeles } from "@/core/actions/canvas";
import { Loader, ImageUp, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useCallback, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface CombinedPixelSelectorProps {
  coors: { x: number; y: number };
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchPintar: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  setPagoparToken: React.Dispatch<React.SetStateAction<string>>;
  refetchOcupados: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  setOpenAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PixelSelector = ({
  coors,
  openModal,
  setOpenModal,
  refetchPintar,
  setPagoparToken,
  refetchOcupados,
  setOpenAlertModal
}: CombinedPixelSelectorProps) => {

  const queryClient = useQueryClient();
  // Estado para elegir el modo: 'manual' o 'image'
  const [mode, setMode] = useState<"manual" | "image">("manual");
  const [link, setLink] = useState('');

  // Estado para selección manual
  const [manualColors, setManualColors] = useState<string[]>(
    Array(25).fill("#ffffff")
  );

  // Estados para selección por imagen
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(5);
  const [imageColors, setImageColors] = useState<string[]>([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  // Estado para almacenar el área recortada en píxeles (relativa a la imagen original)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hook de mutación para enviar los datos al backend
  const { isPending, mutate } = useMutation({
    mutationFn: async (grupo_pixeles: GrupoPixeles) => {
      const respuesta = await postGrupoPixeles(grupo_pixeles);
      return respuesta;
    },
    onSuccess: (respuesta) => {
      const { data } = respuesta

      if (data && data.data && data.data.dataToken) {
        setPagoparToken(data.data.dataToken);
        setOpenModal(false);
        setCropModalOpen(false);
        setOpenAlertModal(true);
      } else {
        console.log('error xd');

      }
      // TODO: hacer un listener de ws
      // queryClient.invalidateQueries({ queryKey: ["ocupados", "pintar"] });
      // refetchPintar();
      // refetchOcupados();
      // toast.success("Colors sent successfully");
    },
    onError: () => {
      toast.error("There was an error processing the colors");
    },
  });

  // Actualiza el color en la grilla manual
  const handleManualColorChange = (index: number, color: string) => {
    const newColors = [...manualColors];
    newColors[index] = color;
    setManualColors(newColors);
  };

  // Configuración de dropzone para el modo imagen
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Reiniciamos el crop y zoom
      setCrop({ x: 0, y: 0 });
      setZoom(5);

      if (fileRejections.length > 0) {
        toast.error("The file is not an image");
        return;
      }

      const file = acceptedFiles[0];
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);

        // Pre-cargamos la imagen para obtener sus dimensiones
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
        };
        img.src = imageUrl;

        setImageSrc(imageUrl);
        setCropModalOpen(true);
      } catch (error) {
        toast.error("An error occurred while processing the image");
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Función para extraer los colores de la sección recortada (5x5 píxeles)
  const extractPixelColors = async (croppedAreaPixels: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const image = imgRef.current;
    // Configuramos el canvas para 5x5 píxeles
    canvas.width = 5;
    canvas.height = 5;
    ctx.imageSmoothingEnabled = false;

    // Calculamos las escalas (ya que croppedAreaPixels está relativo a la imagen mostrada)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const exactX = Math.floor(croppedAreaPixels.x * scaleX);
    const exactY = Math.floor(croppedAreaPixels.y * scaleY);
    const exactWidth = Math.floor(croppedAreaPixels.width * scaleX);
    const exactHeight = Math.floor(croppedAreaPixels.height * scaleY);

    ctx.drawImage(image, exactX, exactY, exactWidth, exactHeight, 0, 0, 5, 5);

    const colorsArray: string[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${[pixel[0], pixel[1], pixel[2]]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")}`;
        colorsArray.push(color);
      }
    }
    return colorsArray;
  };

  // Al completar el crop se extraen los colores y se guarda el área recortada
  const onCropComplete = useCallback(
    async (
      _croppedArea: any,
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
      const colors = await extractPixelColors(croppedAreaPixels);
      if (colors) {
        setImageColors(colors);
      }
    },
    []
  );

  // Función para descargar la imagen con el área seleccionada (rectángulo rojo de 2px)
  const handleDownloadCroppedImage = () => {
    if (!imgRef.current || !croppedAreaPixels) {
      toast.error("No crop area defined");
      return;
    }
    const img = imgRef.current;
    // Creamos un canvas off-screen con el tamaño de la imagen original
    const canvasDownload = document.createElement("canvas");
    canvasDownload.width = img.naturalWidth;
    canvasDownload.height = img.naturalHeight;
    const ctx = canvasDownload.getContext("2d");
    if (!ctx) return;

    // Dibujamos la imagen completa en el canvas
    ctx.drawImage(img, 0, 0, canvasDownload.width, canvasDownload.height);

    // Dibujamos el rectángulo rojo. Asumimos que croppedAreaPixels está en relación a la imagen original.
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    // Convertimos el canvas a data URL y desencadenamos la descarga
    const dataUrl = canvasDownload.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "image_with_crop.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Al confirmar, armamos el objeto a enviar según el modo seleccionado
  const handleConfirm = () => {
    let pixeles;

    if (mode === "manual") {
      pixeles = manualColors.map((color, index) => ({
        coordenada_x: coors.x + (index % 5),
        coordenada_y: coors.y + Math.floor(index / 5),
        color,
      }));
    } else {
      if (!imageColors.length) {
        toast.error("No colors have been extracted from the image");
        return;
      }
      pixeles = imageColors.map((color, index) => ({
        coordenada_x: coors.x + (index % 5),
        coordenada_y: coors.y + Math.floor(index / 5),
        color,
      }));
      // linkValue = imageSrc || linkValue;
    }

    const grupo_pixeles_params = {
      grupo_pixeles: {
        link: link,
        coordenada_x_inicio: coors.x,
        coordenada_y_inicio: coors.y,
        coordenada_x_fin: coors.x + 4,
        coordenada_y_fin: coors.y + 4,
      },
      pixeles,
    };

    mutate(grupo_pixeles_params);
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-background max-h-screen h-[90vh] overflow-y-auto">
          {/* <div className="flex-1  flex-col overflow-y-auto w-full"> */}
          <DialogHeader>
            <DialogTitle className="text-base">
              Customize your <span className="text-lime-600">Pixels</span>
            </DialogTitle>
          </DialogHeader>

          {/* Selector de modo */}
          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant={mode === "manual" ? "default" : "outline"}
              onClick={() => setMode("manual")}
            >
              Manual Selection
            </Button>
            <Button
              variant={mode === "image" ? "default" : "outline"}
              onClick={() => setMode("image")}
            >
              Upload an Image
            </Button>
          </div>

          {mode === "manual" && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-5 gap-0">
                {Array.from({ length: 25 }).map((_, index) => (
                  <input
                    key={index}
                    type="color"
                    className="h-10 w-10 m-0 p-0 border border-slate-400"
                    value={manualColors[index]}
                    onChange={(e) =>
                      handleManualColorChange(index, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {mode === "image" && (
            <>
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
                      maxZoom={100}
                      cropSize={{ width: 100, height: 100 }}
                      onMediaLoaded={() => {
                        const img = new Image();
                        img.src = imageSrc;
                        img.onload = () => {
                          imgRef.current = img;
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
                  {/* Botón para descargar la imagen con el rectángulo rojo */}
                  {croppedAreaPixels && (
                    <div className="w-full flex items-center justify-center">
                      <Button
                        onClick={handleDownloadCroppedImage}
                        className="mt-4  bg-red-600 hover:bg-red-700 text-white"
                      >
                        Download Image with Crop
                      </Button>
                    </div>
                  )}
                </>
              )}

              {imageColors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mx-auto w-fit text-gray-400 mb-2">
                    Preview your Pixels:
                  </p>
                  <div className="grid grid-cols-5 gap-0 w-fit mx-auto">
                    {imageColors.map((color, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col w-full items-center justify-center">
            <label>Add a link or text of your choice</label>
            <input
              type="text"
              placeholder="https://example.com or Hi mom C:"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="p-1 border-2 w-4/6 border-slate-200 rounded-lg"
            />
          </div>
          <DialogFooter>
            <Button
              disabled={
                isPending || (mode === "image" && imageColors.length === 0)
              }
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
      {/* Canvas oculto para extraer los píxeles */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};
