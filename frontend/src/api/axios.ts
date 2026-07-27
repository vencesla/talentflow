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

    // Redirige uniquement si le 401 survient hors de la page de connexion
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const authStore = useAuthStore();

      // Réinitialise l'état Pinia + localStorage
      authStore.logout();

      // Redirection si l'utilisateur n'est pas déjà sur la page de login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
