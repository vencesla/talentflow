<template>
  <div class="container my-4">
    <div class="card shadow-sm">
      <div
        class="card-header bg-white py-3 d-flex align-items-center justify-content-between"
      >
        <h4 class="card-title small mb-0">Gestion de la Marque Employeur</h4>
        <span v-if="hasDraft" class="badge bg-info text-dark">
          Brouillon enregistré
        </span>
      </div>

      <div class="card-body">
        <!-- Message d'erreur global API -->
        <div
          v-if="companyStore.error"
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {{ companyStore.error }}
        </div>

        <!-- Navigation par Onglets Bootstrap -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <button
              type="button"
              class="nav-link"
              :class="{
                active: currentTab === 'general',
                'text-danger': tabHasErrors('general'),
              }"
              @click="currentTab = 'general'"
            >
              Informations Générales
              <span v-if="tabHasErrors('general')" class="badge bg-danger ms-1"
                >!</span
              >
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link"
              :class="{
                active: currentTab === 'location',
                'text-danger': tabHasErrors('location'),
              }"
              @click="currentTab = 'location'"
            >
              Localisation
              <span v-if="tabHasErrors('location')" class="badge bg-danger ms-1"
                >!</span
              >
            </button>
          </li>
        </ul>

        <!-- Formulaire avec Soumission Globale -->
        <form @submit.prevent="handleSubmit">
          <!-- Contenu des Onglets -->
          <div class="tab-content">
            <CompanyGeneralTab
              v-show="currentTab === 'general'"
              v-model="formData"
              :errors="errors"
            />
            <CompanyLocationTab
              v-show="currentTab === 'location'"
              v-model="formData"
              :errors="errors"
            />
          </div>

          <!-- Barre d'actions en bas -->
          <div class="d-flex justify-content-between mt-4 pt-3 border-top">
            <button
              v-if="currentTab === 'location'"
              type="button"
              class="btn btn-outline-secondary"
              @click="currentTab = 'general'"
            >
              Précédent
            </button>

            <button
              v-if="currentTab === 'general'"
              type="button"
              class="btn btn-primary ms-auto"
              @click="goToLocationTab"
            >
              Suivant
            </button>

            <button
              v-if="currentTab === 'location'"
              type="submit"
              class="btn btn-primary ms-auto"
              :disabled="companyStore.loading"
            >
              <span
                v-if="companyStore.loading"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCompanyStore } from "@/stores/companyStore";
import { generalInfoSchema, companySchema } from "@/schemas/company.schema";
import type { updateCompanyType } from "@/schemas/company.schema";
import CompanyGeneralTab from "@/components/company/CompanyGeneralTab.vue";
import CompanyLocationTab from "@/components/company/CompanyLocationTab.vue";

const STORAGE_KEY = "company_general_draft";

const companyStore = useCompanyStore();
const currentTab = ref<"general" | "location">("general");
const errors = ref<Record<string, string>>({});
const hasDraft = ref<boolean>(false);

const formData = ref<updateCompanyType>({
  name: "",
  siret: "",
  industry: "",
  description: "",
  website: "",
  logo: "",
  address: "",
  zipCode: "",
  city: "",
  country: "France",
});

onMounted(async () => {
  companyStore.error = null;

  const existingCompany = await companyStore.fetchMyCompany();

  if (existingCompany) {
    // 💡 Astuce : On s'assure qu'AUCUN champ ne reste à `null`
    formData.value = {
      name: existingCompany.name || "",
      siret: existingCompany.siret || "",
      industry: existingCompany.industry || "",
      description: existingCompany.description || "",
      website: existingCompany.website || "",
      logo:
        (existingCompany as any).logo || (existingCompany as any).logo || "",
      address: existingCompany.address || "",
      zipCode: existingCompany.zipCode || "",
      city: existingCompany.city || "",
      country: existingCompany.country || "France",
    };
    localStorage.removeItem(STORAGE_KEY);
    hasDraft.value = false;
  }
});

// Clic sur SUIVANT : Sauvegarde des données de l'onglet courant (Général)
function goToLocationTab() {
  const result = generalInfoSchema.safeParse(formData.value);
  if (!result.success) {
    errors.value = {};
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message;
      }
    });
    return;
  }

  const generalData = {
    name: formData.value.name,
    siret: formData.value.siret,
    industry: formData.value.industry,
    description: formData.value.description,
    website: formData.value.website,
    logo: formData.value.logo,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(generalData));
  hasDraft.value = true;

  clearErrors(["name", "siret", "industry", "description", "website", "logo"]);
  currentTab.value = "location";
}

function tabHasErrors(tab: "general" | "location"): boolean {
  const generalFields = [
    "name",
    "siret",
    "industry",
    "description",
    "website",
    "logo",
  ];
  const locationFields = ["address", "zipCode", "city", "country"];
  const targetFields = tab === "general" ? generalFields : locationFields;
  return targetFields.some((field) => !!errors.value[field]);
}

function clearErrors(fields: string[]) {
  fields.forEach((field) => delete errors.value[field]);
}

async function handleSubmit() {
  errors.value = {};

  // 1. Validation Frontend
  const result = companySchema.safeParse(formData.value);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message;
      }
    });

    // Rediriger vers le bon onglet contenant l'erreur
    if (tabHasErrors("general")) {
      currentTab.value = "general";
    } else if (tabHasErrors("location")) {
      currentTab.value = "location";
    }
    return;
  }

  // 2. Appel API
  const res = await companyStore.saveCompany(formData.value);

  if (res) {
    // Succès
    localStorage.removeItem(STORAGE_KEY);
    hasDraft.value = false;
  } else {
    // Si l'API a renvoyé une erreur, inspectez la console
    console.error("Échec de l'enregistrement API:", companyStore.error);
  }
}
</script>
