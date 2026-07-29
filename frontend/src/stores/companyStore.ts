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
    error.value = null; // Reinitialise l'erreur d'IHM au départ

    try {
      const data = await companyRepository.getCompany();

      // Si l'API renvoie null, undefined ou un objet vide
      if (!data || (!data.id && !data.name)) {
        company.value = null;
        authStore.setHasCompany(false);
        return null;
      }

      // Normalisation des champs null en chaînes vides pour l'IHM
      const sanitizedData: updateCompanyType = {
        name: data.name || "",
        siret: data.siret || "",
        industry: data.industry || "",
        description: data.description || "",
        website: data.website || "",
        logoUrl: (data as any).logoUrl || (data as any).logo || "",
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
        error.value = null; //
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

  async function saveCompany(
    payload: updateCompanyType,
  ): Promise<companyType | null> {
    loading.value = true;
    error.value = null;

    try {
      let result: companyType;

      // 💡 Si l'entreprise n'existe pas encore (pas d'ID), on passe en CRÉATION (POST)
      if (!company.value?.id) {
        result = await companyRepository.createCompany(payload);
      } else {
        // Sinon, on met à jour l'entreprise existante (PUT)
        result = await companyRepository.updateCompany(payload);
      }

      company.value = result;
      authStore.setHasCompany(true);
      return result;
    } catch (err: any) {
      console.error("Détail de l'erreur API :", err.response?.data || err);

      const apiMessage =
        err.response?.data?.message || err.response?.data?.error;
      error.value = apiMessage || "Erreur lors de l'enregistrement.";

      return null;
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
