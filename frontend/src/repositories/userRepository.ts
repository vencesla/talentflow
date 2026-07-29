import api from "@/api/axios";
import {
  userSchema,
  type User,
  type RegisterInput,
} from "@/schemas/user.schema";

export const userRepository = {
  /**
   * Récupère le profil de l'utilisateur connecté (/api/me)
   */
  async getMe(): Promise<User> {
    const response = await api.get("/me");
    return userSchema.parse(response.data);
  },

  /**
   * Inscription d'un nouvel utilisateur (Candidat ou Recruteur)
   */
  async register(payload: RegisterInput): Promise<User> {
    const response = await api.post("/user/register", payload);
    return userSchema.parse(response.data);
  },

  /**
   * Met à jour le profil de l'utilisateur connecté
   */
  async updateMe(payload: Partial<User>): Promise<User> {
    const response = await api.patch("user/update", payload);
    return userSchema.parse(response.data);
  },

  /**
   * Supprime le compte de l'utilisateur connecté
   */
  async deleteMe(): Promise<void> {
    await api.delete("User/delete/me");
  },
};
