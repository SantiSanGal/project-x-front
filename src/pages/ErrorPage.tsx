import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-stone-950 flex items-center justify-center mt-0">
      <div className="flex flex-col max-h-40 max-w-80  w-full h-full p-4">
        <h1 className="text-white text-center w-full text-2xl">404</h1>
        <h1 className="text-white text-center w-full text-2xl">
          Are you lost?
        </h1>
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
