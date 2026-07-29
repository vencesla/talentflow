import { z } from "zod";
import { companySchema } from "./company.schema";

// --- Types de contrats ---
export const CONTRACT_TYPES = [
  "CDI",
  "CDD",
  "Freelance",
  "Alternance",
  "Stage",
] as const;

// Helper : transforme `null` ou `undefined` en `[]` avant validation
const safeArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (val === null || val === undefined ? [] : val),
    z.array(schema),
  );

// --- Réponse API : User (/api/me) ---
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  roles: z.array(z.string()),
  createdAt: z.string().optional(),

  // Flag & relation Recruteur (nécessaire pour l'onboarding)
  hasCompany: z.boolean().default(false),
  companyId: z.number().nullable().optional(),
  company: companySchema.nullable().optional(),

  // Préférences Candidat (Sécurisées contre les `null` retournés par Symfony)
  jobTitles: safeArray(z.string()),
  locations: safeArray(z.string()),
  contractTypes: safeArray(z.string()),
});

export type User = z.infer<typeof userSchema>;

// --- Formulaire d'inscription ---
export const registerSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),

  // Rôle choisi à l'inscription (ROLE_CANDIDATE ou ROLE_RECRUITER)
  roles: z
    .array(z.enum(["ROLE_CANDIDATE", "ROLE_RECRUITER"]))
    .min(1, "Veuillez choisir un rôle"),

  // Informations candidat (Optionnelles à l'inscription)
  jobTitles: z.array(z.string()).default([]),
  locations: z.array(z.string()).max(10, "10 localités max").default([]),
  contractTypes: z.array(z.enum(CONTRACT_TYPES)).default([]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
