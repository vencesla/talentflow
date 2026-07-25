import { z } from "zod";

// --- Réponse API: User ---
export const ApiUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.string(),
  roles: z.array(z.string()),
});

export type ApiUser = z.infer<typeof ApiUserSchema>;

export const UsersListResponseSchema = z.array(ApiUserSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "8 caractères minimum"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  email: z.email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

// --- Formulaire d'inscription ---
export const registerSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  // Le rôle est restreint aux deux types d'utilisateurs
  roles: z
    .array(z.enum(["ROLE_CANDIDATE", "ROLE_RECRUITER"]))
    .min(1, "Veuillez choisir au moins un type de compte"),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
