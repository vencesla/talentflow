import { z } from "zod";

const optionalUrl = z
  .union([
    z.string().url("Format d'URL invalide (ex: https://exemple.com)"),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((val) => val ?? "");

// Onglet 1 : Infos Générales & Identité
export const generalInfoSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est obligatoire"),
  siret: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  website: optionalUrl,
  logoUrl: optionalUrl,
});

// Onglet 2 : Localisation / Adresse
export const locationSchema = z.object({
  address: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
});

export const updateCompanySchema = generalInfoSchema.merge(locationSchema);

export const companySchema = updateCompanySchema.extend({
  id: z.number().optional(),
});

export type companyType = z.infer<typeof companySchema>;
export type locationType = z.infer<typeof locationSchema>;
export type generalInfosType = z.infer<typeof generalInfoSchema>;
export type updateCompanyType = z.infer<typeof updateCompanySchema>;
