import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-stone-950 grid place-content-center">
      <div className="flex flex-col w-16 h-16 p-4">
        <p>
          Muchas Gracias, recibiremos la confirmación de su donación y
          agregaremos los pixeles que nos ha enviado.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Go to the canvas
        </button>
      </div>
    </div>
  );
};
