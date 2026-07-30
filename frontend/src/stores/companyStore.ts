import { ref } from "vue";
import { defineStore } from "pinia";
import type { companyType, updateCompanyType } from "@/schemas/company.schema";
import { companyRepository } from "@/repositories/companyRepository";
import { useAuthStore } from "./authStore";

export const useCompanyStore = defineStore("company", () => {
  const company = ref<companyType | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const authStore = useAuthStore();

  async function fetchMyCompany(): Promise<updateCompanyType | null> {
    loading.value = true;
    error.value = null;

    try {
      const data = await companyRepository.getCompany();

      if (!data || (!data.id && !data.name)) {
        company.value = null;
        authStore.setHasCompany(false);
        return null;
      }

      const sanitizedData: updateCompanyType = {
        name: data.name || "",
        siret: data.siret || "",
        industry: data.industry || "",
        description: data.description || "",
        website: data.website || "",
        logo: (data as any).logo || "",
        address: data.address || "",
        zipCode: data.zipCode || "",
        city: data.city || "",
        country: data.country || "France",
      };

      company.value = data;
      authStore.setHasCompany(true);

      return sanitizedData;
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 404 || status === 400 || status === 422) {
        company.value = null;
        authStore.setHasCompany(false);
        error.value = null;
        return null;
      }

      if (status >= 500) {
        error.value = "Le serveur ne répond pas. Veuillez réessayer plus tard.";
      } else {
        error.value = null;
      }

      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Enregistre (POST) ou met à jour (PUT) l'entreprise.
   * Renvoie true en cas de succès, false en cas d'erreur.
   */
  async function saveCompany(payload: updateCompanyType): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      let result: companyType;

      // Si l'entreprise n'existe pas encore (pas d'ID), on passe en CRÉATION
      if (!company.value?.id) {
        result = await companyRepository.createCompany(payload);
      } else {
        result = await companyRepository.updateCompany(payload);
      }

      company.value = result;
      authStore.setHasCompany(true);
      return true;
    } catch (err: any) {
      console.error("Détail de l'erreur API :", err.response?.data || err);

      const apiMessage =
        err.response?.data?.message || err.response?.data?.error;
      error.value = apiMessage || "Erreur lors de l'enregistrement.";

      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    company,
    loading,
    error,
    fetchMyCompany,
    saveCompany,
  };
});
