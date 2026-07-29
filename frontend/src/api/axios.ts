import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : Injection du token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur de réponse : Gestion de l'expiration du token (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/login_check");

    // Redirige uniquement si le 401 survient hors du chemin d'authentification
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const authStore = useAuthStore();

      // Réinitialise l'état Pinia + localStorage
      authStore.logout();

      const authPath = "/connexion-inscription.html";

      // Redirection si l'utilisateur n'est pas déjà sur la page d'auth
      if (!window.location.pathname.includes(authPath)) {
        window.location.href = `${authPath}#connexion`;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
