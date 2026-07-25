import { defineStore } from "pinia";
import { userApi } from "@/api/user.api";
import type { ApiUser } from "@/schemas/user.schema";

interface AuthState {
  currentUser: ApiUser | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    // On conserve l'utilisateur dans le localStorage pour éviter de perdre la session au F5
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
  }),

  getters: {
    user: (state) => state.currentUser,

    // Connecté si un utilisateur existe en mémoire
    isAuthenticated: (state) => !!state.currentUser,

    // Vérification générique de rôle (compatible string[] ou objets)
    hasRole: (state) => {
      return (role: string): boolean => {
        if (!state.currentUser?.roles) return false;
        return state.currentUser.roles.some((r) =>
          typeof r === "string" ? r === role : (r as any).name === role,
        );
      };
    },

    isCandidate(): boolean {
      return this.hasRole("ROLE_CANDIDATE");
    },

    isRecruiter(): boolean {
      return this.hasRole("ROLE_RECRUITER");
    },
  },

  actions: {
    // 🔐 Inscription : enregistre l'utilisateur directement après création
    async register(userData: {
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
    }) {
      this.loading = true;
      this.error = null;

      try {
        // Envoi au backend
        const newUser = await userApi.create(userData);

        // On connecte immédiatement l'utilisateur
        this.setUserSession(newUser);
        return newUser;
      } catch (err: any) {
        console.error("Erreur détaillée lors de l'inscription :", err);

        if (err.errors) {
          console.error("Erreurs Zod / Validation :", err.errors);
        }

        // Enregistre l'erreur dans le state
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'inscription";

        // ⚠️ CRUCIAL : On propage l'erreur pour que le try/catch de AuthView reçoive l'échec
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string) {
      this.loading = true;
      this.error = null;
      try {
        const users = await userApi.getAll();
        const user = users.find((u: ApiUser) => u.email === email);

        if (!user) {
          throw new Error("Aucun compte trouvé avec cet email");
        }

        this.setUserSession(user);
        return user;
      } catch (e: any) {
        this.error = e.message || "Erreur de connexion";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    // Déconnexion
    logout() {
      this.currentUser = null;
      localStorage.removeItem("user");
    },

    // Helper interne pour sauvegarder dans Pinia + localStorage
    setUserSession(user: ApiUser) {
      this.currentUser = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
  },
});
