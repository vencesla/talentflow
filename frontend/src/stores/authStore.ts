import { defineStore } from "pinia";
import api from "@/api/axios";

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token") || null,
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isCandidate: (state): boolean =>
      state.currentUser?.roles.includes("ROLE_CANDIDATE") ?? false,
    isRecruiter: (state): boolean =>
      state.currentUser?.roles.includes("ROLE_RECRUITER") ?? false,
    isAdmin: (state): boolean =>
      state.currentUser?.roles.includes("ROLE_ADMIN") ?? false,

    hasRole: (state) => {
      return (role: string): boolean => {
        if (!state.currentUser || !state.currentUser.roles) {
          return false;
        }
        return state.currentUser.roles.includes(role);
      };
    },
  },

  actions: {
    /**
     * Inscription : Création du compte (/user) puis auto-connexion
     */
    async register(payload: RegisterPayload): Promise<User> {
      this.loading = true;
      this.error = null;
      try {
        // 1. Création de l'utilisateur
        await api.post("/user", payload);

        // 2. Connexion automatique après inscription
        await this.login({
          email: payload.email,
          password: payload.password,
        });

        if (!this.currentUser) {
          throw new Error(
            "Impossible de récupérer l'utilisateur après inscription.",
          );
        }

        return this.currentUser;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Erreur lors de l'inscription.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Connexion : Obtention du token puis récupération du profil utilisateur (/me)
     */
    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Authentification LexikJWT
        const { data } = await api.post<{ token: string }>(
          "/login_check",
          credentials,
        );

        this.token = data.token;
        localStorage.setItem("token", data.token);

        // 2. Récupération des infos de l'utilisateur connecté
        await this.fetchCurrentUser();
      } catch (err: any) {
        this.error = err.response?.data?.message || "Identifiants invalides.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Charge les infos du profil depuis `/api/me`
     */
    async fetchCurrentUser() {
      try {
        const { data } = await api.get<User>("/user/me");
        this.currentUser = data;
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    /**
     * Mettre à jour son propre profil (/api/me)
     */
    async updateProfile(updatedData: {
      email?: string;
      firstName?: string;
      lastName?: string;
    }) {
      const { data } = await api.put<User>("/me", updatedData);
      this.currentUser = data;
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    },

    /**
     * Déconnexion
     */
    logout() {
      this.token = null;
      this.currentUser = null;
      this.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
