import { useNavigate, useParams } from "react-router-dom";
import { getEstadoPago } from "@/core/actions/pagopar";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store";
import { Loader } from "lucide-react";

export const Redirect = () => {
  const { isLogged } = useUserStore.getState();
  const navigate = useNavigate();
  const { hash: hashPedido } = useParams();

  // console.log('hashPedido', hashPedido);


  const { data, isPending } = useQuery({
    queryKey: ["consulta-estado-pago"],
    queryFn: async () => {
      const respuesta = await getEstadoPago(isLogged, hashPedido!);
      // console.log("respuesta", respuesta);
      return respuesta;
    },
  });

  // console.log("data", data);

  return (
    <div className="w-screen h-screen bg-stone-950 flex items-center justify-center mt-0">
      <div className="flex flex-col max-h-40 max-w-80  w-full h-full p-4">
        {isPending ? (
          <div className="flex gap-2 items-center">
            <h1 className="text-white">Checking payment</h1>
            <Loader className="size-8 text-white animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-white">
              Thank you very much! We will receive the confirmation of your
              donation and add the pixels you have sent us.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Let's go to the canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
