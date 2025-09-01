import { GrupoPixeles, postGrupoPixeles } from "@/core/actions/canvas";
import { Loader, ImageUp, ZoomIn, ZoomOut } from "lucide-react";
import React, { useState, useCallback, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Cropper from "react-easy-crop";
import SwitchCustom from "@/components/SwitchCustom";
import {
  Slider,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { GRID_SIZE } from "@/constants"; // <-- ahora usamos la constante global

interface CombinedPixelSelectorProps {
  coors: { x: number; y: number };
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetchPintar: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  setPagoparToken: React.Dispatch<React.SetStateAction<string>>;
  setCodeReferShow: React.Dispatch<React.SetStateAction<string>>;
  refetchOcupados: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  setOpenAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Options = [
  { label: "Manual", value: "manual" },
  { label: "Image", value: "image" },
];

// Derivados a partir de GRID_SIZE
const BLOCK_SIDE = GRID_SIZE; // 10
const BLOCK_PIXELS = GRID_SIZE * GRID_SIZE; // 100

export const PixelSelector = ({
  coors,
  openModal,
  setOpenModal,
  // refetchPintar,
  setPagoparToken,
  setCodeReferShow,
  // refetchOcupados,
  setOpenAlertModal,
}: CombinedPixelSelectorProps) => {
  // Estado para elegir el modo
  const [selected, setSelected] = useState(Options[0]);
  // const [referCode, setReferCode] = useState("");
  const [link, setLink] = useState("");

  // -------- MODO MANUAL (10×10) --------
  const [manualColors, setManualColors] = useState<string[]>(
    Array(BLOCK_PIXELS).fill("#ffffff")
  );

  // -------- MODO IMAGEN (crop + extracción 10×10) --------
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(5);
  const [imageColors, setImageColors] = useState<string[]>([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* --------------------------------- Queries -------------------------------- */
  const { isPending, mutate } = useMutation({
    mutationFn: async (grupo_pixeles: GrupoPixeles) => {
      const respuesta = await postGrupoPixeles(grupo_pixeles);
      return respuesta;
    },
    onSuccess: (respuesta) => {
      const { data } = respuesta;
      if (data && data.data && data.data.dataToken) {
        setCodeReferShow(data.data.code_for_refer);
        setPagoparToken(data.data.dataToken);
        setOpenModal(false);
        setCropModalOpen(false);
        setOpenAlertModal(true);
      }
    },
    onError: () => {
      toast.error("There was an error processing the colors");
    },
  });
  /* ------------------------------- End Queries ------------------------------ */

  // Actualiza color manual
  const handleManualColorChange = (index: number, color: string) => {
    const newColors = [...manualColors];
    newColors[index] = color;
    setManualColors(newColors);
  };

  // Dropzone (modo imagen)
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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

        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
        };
        img.src = imageUrl;

        setImageSrc(imageUrl);
        setCropModalOpen(true);
      } catch {
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

  // Extraer colores 10×10 desde el crop
  const extractPixelColors = async (area: {
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

    // Canvas de destino: 10×10
    canvas.width = BLOCK_SIDE;
    canvas.height = BLOCK_SIDE;

    // ¡Importante para “pixel art”!
    ctx.imageSmoothingEnabled = false;

    // Pasar del área del crop (en coords de la imagen mostrada) a la imagen original
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const exactX = Math.floor(area.x * scaleX);
    const exactY = Math.floor(area.y * scaleY);
    const exactWidth = Math.floor(area.width * scaleX);
    const exactHeight = Math.floor(area.height * scaleY);

    // Reescalar esa área a 10×10 sin suavizado
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      exactX,
      exactY,
      exactWidth,
      exactHeight,
      0,
      0,
      BLOCK_SIDE,
      BLOCK_SIDE
    );

    // Leer los 100 colores (fila mayor a menor importancia)
    const colorsArray: string[] = [];
    for (let y = 0; y < BLOCK_SIDE; y++) {
      for (let x = 0; x < BLOCK_SIDE; x++) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${[pixel[0], pixel[1], pixel[2]]
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("")}`;
        colorsArray.push(color);
      }
    }
    return colorsArray;
  };

  // Al completar el crop → extraer 10×10
  const onCropComplete = useCallback(
    async (
      _croppedArea: any,
      areaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(areaPixels);
      const colors = await extractPixelColors(areaPixels);
      if (colors) setImageColors(colors);
    },
    []
  );

  // Descargar imagen con el rectángulo del crop (opcional)
  const handleDownloadCroppedImage = () => {
    if (!imgRef.current || !croppedAreaPixels) {
      toast.error("No crop area defined");
      return;
    }
    const img = imgRef.current;

    const canvasDownload = document.createElement("canvas");
    canvasDownload.width = img.naturalWidth;
    canvasDownload.height = img.naturalHeight;
    const ctx = canvasDownload.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, canvasDownload.width, canvasDownload.height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const dataUrl = canvasDownload.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "image_with_crop.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Confirmar y armar payload (10×10)
  const handleConfirm = () => {
    let pixeles;

    if (selected.value === "manual") {
      pixeles = manualColors.map((color, index) => ({
        coordenada_x: coors.x + (index % BLOCK_SIDE),
        coordenada_y: coors.y + Math.floor(index / BLOCK_SIDE),
        color,
      }));
    } else {
      if (!imageColors.length) {
        toast.error("No colors have been extracted from the image");
        return;
      }
      pixeles = imageColors.map((color, index) => ({
        coordenada_x: coors.x + (index % BLOCK_SIDE),
        coordenada_y: coors.y + Math.floor(index / BLOCK_SIDE),
        color,
      }));
    }

    const grupo_pixeles_params = {
      grupo_pixeles: {
        link: link,
        coordenada_x_inicio: coors.x,
        coordenada_y_inicio: coors.y,
        coordenada_x_fin: coors.x + (BLOCK_SIDE - 1), // +9
        coordenada_y_fin: coors.y + (BLOCK_SIDE - 1), // +9
      },
      pixeles,
      // refer_code: referCode,
    };

    mutate(grupo_pixeles_params as unknown as GrupoPixeles);
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-h-screen rounded-md flex flex-col justify-between w-[95vw] h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 flex flex-col gap-4">
            <DialogTitle className="text-base">
              Customize your <span className="text-lime-600">Pixels</span>
            </DialogTitle>

            <SwitchCustom
              className="h-8 sm:w-[332px] xl:w-[618.91px]"
              selected={selected.value}
              onClick={setSelected}
              options={Options}
            />
          </DialogHeader>

          {/* --------- MODO MANUAL: 10×10 --------- */}
          {selected.value === "manual" && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-10 gap-0">
                {Array.from({ length: BLOCK_PIXELS }).map((_, index) => (
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

          {/* --------- MODO IMAGEN: crop + preview 10×10 --------- */}
          {selected.value === "image" && (
            <div className="flex flex-col gap-2 items-center w-full">
              <div
                {...getRootProps()}
                className="cursor-pointer w-[90%] text-center p-4 border-2 border-dashed rounded-lg"
              >
                <input {...getInputProps()} />
                <ImageUp className="mx-auto mb-2" />
                <p>Drag and drop an image here, or click to select one</p>
              </div>

              {imageSrc && cropModalOpen && (
                <div className="w-[90%]">
                  <div className="relative h-80">
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
                      // tamaño visual del cuadro del crop (px de pantalla)
                      cropSize={{
                        width: BLOCK_SIDE * 10,
                        height: BLOCK_SIDE * 10,
                      }} // 100×100
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

                  {croppedAreaPixels && (
                    <div className="w-full flex items-center justify-center">
                      <Button
                        onClick={handleDownloadCroppedImage}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                      >
                        Download Image with Crop
                      </Button>
                    </div>
                  )}

                  {imageColors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm mx-auto w-fit text-gray-400 mb-2">
                        Preview your Pixels:
                      </p>
                      <div className="grid grid-cols-10 gap-0 w-fit mx-auto">
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
                </div>
              )}
            </div>
          )}

          {/* --------- Campos extra --------- */}
          <div className="flex flex-col w-full items-center justify-center gap-2">
            <div className="flex flex-col w-full items-center justify-start">
              <label>Add a link or text of your choice</label>
              <input
                type="text"
                placeholder="https://example.com or Hi mom C:"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="p-1 border-2 w-4/6 border-slate-200 rounded-lg"
              />
            </div>
            {/* <div className="flex flex-col w-full items-center justify-start">
              <label>Enter a referral code to earn 1 extra point</label>
              <input
                type="text"
                placeholder="Example: TP-1234"
                value={referCode}
                onChange={(e) => setReferCode(e.target.value)}
                className="p-1 border-2 w-4/6 border-slate-200 rounded-lg"
              />
            </div> */}
          </div>

          <DialogFooter className="p-4">
            <Button
              disabled={
                isPending ||
                (selected.value === "image" && imageColors.length === 0)
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

      {/* Canvas oculto para lectura de píxeles al extraer 10×10 */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};
