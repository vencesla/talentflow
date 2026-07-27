import { z } from "zod";

// --- Constante pour les contrats autorisés ---
const CONTRACT_TYPES = [
  "CDI",
  "CDD",
  "Freelance",
  "Alternance",
  "Stage",
] as const;

// --- Réponse API: User ---
export const ApiUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.string(),
  roles: z.array(z.string()),
  // Champs candidat
  jobTitles: z.array(z.string()),
  locations: z.array(z.string()),
  contractTypes: z.array(z.string()),
  // Champs recruteur
  companyName: z.string().nullable().optional(),
  companyWebsite: z.string().nullable().optional(),
});

export type ApiUser = z.infer<typeof ApiUserSchema>;

export const UsersListResponseSchema = z.array(ApiUserSchema);
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// --- Schémas de modification / création d'utilisateur (Admin ou formulaire candidat direct) ---
export const CreateUserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  jobTitles: z
    .array(z.string())
    .min(1, "Veuillez indiquer au moins un métier recherché"),
  locations: z
    .array(z.string())
    .min(1, "Veuillez indiquer au moins une localité")
    .max(10, "Vous ne pouvez pas sélectionner plus de 10 localités"),
  contractTypes: z
    .array(z.enum(CONTRACT_TYPES))
    .min(1, "Veuillez sélectionner au moins un type de contrat"),
});

export const UpdateUserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  jobTitles: z
    .array(z.string())
    .min(1, "Veuillez indiquer au moins un métier recherché"),
  locations: z
    .array(z.string())
    .min(1, "Veuillez indiquer au moins une localité")
    .max(10, "Vous ne pouvez pas sélectionner plus de 10 localités"),
  contractTypes: z
    .array(z.enum(CONTRACT_TYPES))
    .min(1, "Veuillez sélectionner au moins un type de contrat"),
});

// --- Formulaire d'inscription (Gestion dynamique selon le Rôle) ---
export const registerSchema = z
  .object({
    email: z.string().email("Format d'email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    roles: z
      .array(z.enum(["ROLE_CANDIDATE", "ROLE_RECRUITER"]))
      .min(1, "Veuillez choisir au moins un type de compte"),

    // Champs candidat (Optionnels de base)
    jobTitles: z.array(z.string()).default([]),
    locations: z.array(z.string()).default([]),
    contractTypes: z.array(z.enum(CONTRACT_TYPES)).default([]),

    // Champs recruteur (Optionnels de base)
    companyName: z.string().optional(),
    companyWebsite: z.string().url("URL invalide").or(z.literal("")).optional(),
  })
  .superRefine((data, ctx) => {
    // --- Validation si Candidat ---
    if (data.roles.includes("ROLE_CANDIDATE")) {
      if (!data.jobTitles || data.jobTitles.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veuillez indiquer au moins un métier recherché",
          path: ["jobTitles"],
        });
      }

      if (!data.locations || data.locations.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veuillez indiquer au moins une localité",
          path: ["locations"],
        });
      } else if (data.locations.length > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vous ne pouvez pas sélectionner plus de 10 localités",
          path: ["locations"],
        });
      }

      if (!data.contractTypes || data.contractTypes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veuillez sélectionner au moins un type de contrat",
          path: ["contractTypes"],
        });
      }
    }

    // --- Validation si Recruteur ---
    if (data.roles.includes("ROLE_RECRUITER")) {
      if (!data.companyName || data.companyName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le nom de l'entreprise est obligatoire",
          path: ["companyName"],
        });
      }
    }
  });

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserResponseDto = z.infer<typeof ApiUserSchema>;
