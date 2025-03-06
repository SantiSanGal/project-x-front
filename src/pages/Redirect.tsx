import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Redirect = () => {
  const navigate = useNavigate();
  const { hash } = useParams();
  console.log("hash", hash);

  useEffect(() => {
    //TODO: consultar estado del pago
  }, []);

  return (
    <div className="w-screen h-screen bg-stone-950 flex items-center justify-center mt-0">
      <div className="flex flex-col max-h-40 max-w-80  w-full h-full p-4">
        <p className="text-white">
          Thank you very much! We will receive the confirmation of your donation
          and add the pixels you have sent us.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Let's go to the canvas
        </button>
      </div>
    </div>
  );
};
