import { defineStore } from "pinia";
import api from "@/api/axios";
import { type User, type RegisterInput } from "@/schemas/user.schema";
import { userRepository } from "@/repositories/userRepository";

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

    // Getter dynamique et réactif calculé depuis currentUser
    hasCompany: (state): boolean => {
      if (!state.currentUser) return false;
      return (
        state.currentUser.hasCompany === true ||
        !!state.currentUser.companyId ||
        !!(state.currentUser as any).company
      );
    },

    hasRole:
      (state) =>
      (role: string): boolean => {
        return state.currentUser?.roles.includes(role) ?? false;
      },
  },

  actions: {
    async register(payload: RegisterInput): Promise<User> {
      this.loading = true;
      this.error = null;
      try {
        await userRepository.register(payload);
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

    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        localStorage.removeItem("user");
        this.currentUser = null;

        const { data } = await api.post<{ token: string; user: User }>(
          "/login_check",
          credentials,
        );

        this.token = data.token;
        this.currentUser = data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data.user;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Identifiants invalides.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser(): Promise<User> {
      try {
        const user = await userRepository.getMe();
        this.currentUser = user;

        // Met à jour la propriété aCompany sur currentUser sans tenter d'écraser le getter
        const hasCompanyStatus =
          typeof user.hasCompany !== "undefined"
            ? Boolean(user.hasCompany)
            : Boolean(user.companyId || (user as any).company);

        this.setHasCompany(hasCompanyStatus);

        localStorage.setItem("user", JSON.stringify(this.currentUser));
        return this.currentUser;
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    setHasCompany(hasCompany: boolean) {
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          hasCompany,
        };
        localStorage.setItem("user", JSON.stringify(this.currentUser));
      }
    },

    async updateProfile(updatedData: Partial<User>): Promise<User> {
      const user = await userRepository.updateMe(updatedData);
      this.currentUser = user;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    },

    logout() {
      this.token = null;
      this.currentUser = null;
      this.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
