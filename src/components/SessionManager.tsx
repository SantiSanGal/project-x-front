import { useUserStore } from "@/store/loginStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SessionManager = () => {
  const { accessToken, expiresAt, logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && expiresAt) {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      const timeout = expiryDate.getTime() - now.getTime();

      // Si el token ya caducó, se cierra la sesión inmediatamente
      if (timeout <= 0) {
        logout();
      } else {
        // Se programa el logout para cuando expire el token
        const timer = setTimeout(() => {
          logout();
          toast.info("Session expired");
          navigate("/");
        }, timeout);

        // Limpieza del timeout en caso de desmontaje o cambio en la sesión
        return () => clearTimeout(timer);
      }
    }
  }, [accessToken, expiresAt, logout]);

  return null; // Este componente no renderiza nada en la UI
};
