<template>
  <div>
    <!-- BANNIÈRE ACCUEIL INSCRIPTION -->
    <div
      class="profil p-3 p-md-4 rounded-4 mb-4 text-center border border-primary-subtle shadow-sm"
    >
      <h6 class="text-dark mb-2">
        En vous inscrivant à TalentFlow, nous vous aidons à trouver
        <span class="text-primary fw-extrabold">VOTRE</span> job !
      </h6>
      <p class="text-secondary small mb-0">
        Accédez à des milliers d'offres adaptées à votre profil.
      </p>
    </div>

    <!-- Sélecteur de rôle -->
    <label
      class="form-label fw-semibold text-secondary small text-uppercase tracking-wider"
    >
      Vous êtes ?
    </label>
    <div class="role-selector d-flex p-1 bg-light rounded-3 mb-4 border">
      <button
        type="button"
        class="btn flex-fill py-2 fw-semibold rounded-2 border-0 btn-sm transition-all"
        :class="
          selectedRole === 'ROLE_CANDIDATE'
            ? 'bg-white text-primary shadow-sm'
            : 'text-muted'
        "
        @click="selectRole('ROLE_CANDIDATE')"
      >
        👨‍🎓 Candidat
      </button>
      <button
        type="button"
        class="btn flex-fill py-2 fw-semibold rounded-2 border-0 btn-sm transition-all"
        :class="
          selectedRole === 'ROLE_RECRUITER'
            ? 'bg-white text-purple shadow-sm'
            : 'text-muted'
        "
        @click="selectRole('ROLE_RECRUITER')"
      >
        💼 Recruteur
      </button>
    </div>

    <!-- Le novalidate empêche la validation HTML5 par défaut pour laisser Vue tout gérer -->
    <form @submit.prevent="handleRegister" novalidate>
      <div class="row g-3">
        <!-- Prénom -->
        <div class="col-md-6 text-start">
          <label class="form-label fw-medium small text-secondary"
            >Prénom *</label
          >
          <input
            v-model="registerForm.firstName"
            type="text"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.firstName }"
            @input="clearError('firstName')"
          />
          <div
            v-if="errors.firstName"
            class="invalid-feedback text-start d-block"
          >
            {{ errors.firstName }}
          </div>
        </div>

        <!-- Nom -->
        <div class="col-md-6 text-start">
          <label class="form-label fw-medium small text-secondary">Nom *</label>
          <input
            v-model="registerForm.lastName"
            type="text"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.lastName }"
            @input="clearError('lastName')"
          />
          <div v-if="errors.lastName" class="invalid-feedback d-block">
            {{ errors.lastName }}
          </div>
        </div>

        <!-- Email -->
        <div class="col-12 text-start">
          <label class="form-label fw-medium small text-secondary"
            >Adresse email *</label
          >
          <input
            v-model="registerForm.email"
            type="email"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
          />
          <div v-if="errors.email" class="invalid-feedback d-block">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="col-12 text-start">
          <label class="form-label fw-medium small text-secondary"
            >Mot de passe *</label
          >
          <input
            v-model="registerForm.password"
            type="password"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
          />
          <div v-if="errors.password" class="invalid-feedback d-block">
            {{ errors.password }}
          </div>
        </div>

        <!-- Champs spécifiques Candidats -->
        <template v-if="selectedRole === 'ROLE_CANDIDATE'">
          <hr class="my-4" />

          <!-- 1. Métiers -->
          <div class="col-12 text-start">
            <label class="form-label fw-medium small text-secondary"
              >Métiers recherchés *</label
            >
            <div
              class="input-group mb-2"
              :class="{ 'is-invalid': errors.jobTitles }"
            >
              <input
                v-model="newJobInput"
                type="text"
                class="form-control rounded-start-3"
                :class="{ 'is-invalid': errors.jobTitles }"
                placeholder="Chef de projet, comptable, vendeur"
                @keydown.enter.prevent="addJob"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="addJob"
              >
                Ajouter
              </button>
            </div>
            <div v-if="errors.jobTitles" class="invalid-feedback d-block mb-2">
              {{ errors.jobTitles }}
            </div>
            <div class="d-flex flex-wrap gap-1">
              <span
                v-for="(job, index) in registerForm.jobTitles"
                :key="index"
                class="badge bg-primary p-2 d-inline-flex align-items-center"
              >
                {{ job }}
                <button
                  type="button"
                  class="btn-close btn-close-white ms-2"
                  style="font-size: 0.6rem"
                  @click="removeJob(index)"
                ></button>
              </span>
            </div>
          </div>

          <!-- 2. Localités -->
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label
                class="form-label fw-medium small text-secondary mb-0 text-start d-block"
                >Localités recherchées *</label
              >
              <span
                class="small text-muted"
                :class="{
                  'text-danger fw-bold': registerForm.locations.length >= 10,
                }"
              >
                {{ registerForm.locations.length }}/10 max
              </span>
            </div>

            <LocationAutocomplete
              class="mb-2"
              :disabled="registerForm.locations.length >= 10"
              @select="handleSelectLocation"
            />

            <div v-if="errors.locations" class="invalid-feedback d-block mb-2">
              {{ errors.locations }}
            </div>

            <div class="d-flex flex-wrap gap-1">
              <span
                v-for="(loc, index) in registerForm.locations"
                :key="index"
                class="badge bg-info text-dark p-2 d-inline-flex align-items-center"
              >
                {{ loc }}
                <button
                  type="button"
                  class="btn-close ms-2"
                  style="font-size: 0.6rem"
                  @click="removeLocation(index)"
                ></button>
              </span>
            </div>
          </div>

          <!-- 3. Contrats -->
          <div class="col-12">
            <label
              class="form-label fw-medium small text-secondary text-start d-block"
              >Types de contrat recherchés *</label
            >
            <div class="d-flex flex-wrap gap-3">
              <div
                v-for="type in availableContracts"
                :key="type"
                class="form-check"
              >
                <input
                  :id="'contract-' + type"
                  v-model="registerForm.contractTypes"
                  class="form-check-input"
                  :class="{ 'is-invalid': errors.contractTypes }"
                  type="checkbox"
                  :value="type"
                  @change="clearError('contractTypes')"
                />
                <label
                  class="form-check-label small"
                  :for="'contract-' + type"
                  >{{ type }}</label
                >
              </div>
            </div>
            <div v-if="errors.contractTypes" class="invalid-feedback d-block">
              {{ errors.contractTypes }}
            </div>
          </div>
        </template>
        <!-- Champs spécifiques Recruteur via composant dédié -->
        <RecruiterFields
          v-if="selectedRole === 'ROLE_RECRUITER'"
          v-model:company-name="registerForm.companyName"
          v-model:company-website="registerForm.companyWebsite"
          :errors="errors"
        />

        <!-- Submit Button -->
        <div class="col-12 mt-4 text-center">
          <button
            type="submit"
            class="btn rounded-pill fw-bold text-white px-4 py-2 shadow-sm"
            :class="
              selectedRole === 'ROLE_CANDIDATE' ? 'btn-primary' : 'btn-purple'
            "
            :disabled="authStore.loading"
          >
            <span
              v-if="authStore.loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            S'inscrire
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete.vue";
import RecruiterFields from "@/components/RecruiterFields.vue";

const emit = defineEmits<{
  (e: "success", roles: string[]): void;
  (e: "error", message: string): void;
}>();

const authStore = useAuthStore();

const selectedRole = ref<"ROLE_CANDIDATE" | "ROLE_RECRUITER">("ROLE_CANDIDATE");

const registerForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  jobTitles: [] as string[],
  locations: [] as string[],
  contractTypes: [] as string[],
  companyName: "",
  companyWebsite: "",
});

// objets pour suivre les erreurs par champ
const errors = reactive<Record<string, string>>({});

// Champs temporaires pour la saisie par touche "Entrée"
const newJobInput = ref("");
const newLocationInput = ref("");

const availableContracts = ["CDI", "CDD", "Freelance", "Alternance", "Stage"];

const clearError = (field: string) => {
  delete errors[field];
  emit("error", "");
};

// Changer de rôle nettoie aussi les erreurs
const selectRole = (role: "ROLE_CANDIDATE" | "ROLE_RECRUITER") => {
  selectedRole.value = role;
  Object.keys(errors).forEach((key) => delete errors[key]);
  emit("error", "");
};

// --- Gestion des Métiers ---
const addJob = () => {
  const job = newJobInput.value.trim();
  if (job && !registerForm.jobTitles.includes(job)) {
    registerForm.jobTitles.push(job);
    newJobInput.value = "";
    clearError("jobTitles");
  }
};

const removeJob = (index: number) => {
  registerForm.jobTitles.splice(index, 1);
};

// --- Gestion des Localités (Max 10) ---
const addLocation = () => {
  const loc = newLocationInput.value.trim();
  if (!loc) return;

  if (registerForm.locations.length >= 10) {
    emit("error", "Vous ne pouvez pas ajouter plus de 10 localités.");
    return;
  }

  if (!registerForm.locations.includes(loc)) {
    registerForm.locations.push(loc);
    newLocationInput.value = "";
    emit("error", "");
  }
};

const removeLocation = (index: number) => {
  registerForm.locations.splice(index, 1);
};

const handleSelectLocation = (loc: string) => {
  if (registerForm.locations.length >= 10) {
    emit("error", "Vous ne pouvez pas ajouter plus de 10 localités.");
    return;
  }

  if (!registerForm.locations.includes(loc)) {
    registerForm.locations.push(loc);
    clearError("locations");
  }
};

// --- Validation dynamique globale ---
const validateForm = (): boolean => {
  // Réinitialisation des erreurs
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (!registerForm.firstName.trim()) {
    errors.firstName = "Merci de saisir votre prénom.";
    isValid = false;
  }

  if (!registerForm.lastName.trim()) {
    errors.lastName = "Merci de saisir votre nom.";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!registerForm.email.trim()) {
    errors.email = "Merci de saisir une adresse email.";
    isValid = false;
  } else if (!emailRegex.test(registerForm.email)) {
    errors.email = "Veuillez entrer un email valide.";
    isValid = false;
  }

  if (!registerForm.password) {
    errors.password = "Merci de saisir un mot de passe.";
    isValid = false;
  } else if (registerForm.password.length < 8) {
    errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    isValid = false;
  }

  // Validation des champs spécifiques au Candidat
  if (selectedRole.value === "ROLE_CANDIDATE") {
    if (registerForm.jobTitles.length === 0) {
      errors.jobTitles = "Merci de saisir votre métier recherché.";
      isValid = false;
    }
    if (registerForm.locations.length === 0) {
      errors.locations = "Merci de saisir votre localitée recherchée.";
      isValid = false;
    }
    if (registerForm.contractTypes.length === 0) {
      errors.contractTypes = "Veuillez cocher une option.";
      isValid = false;
    }
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    const payload = { ...registerForm, roles: [selectedRole.value] };
    const user = await authStore.register(payload);
    emit("success", user.roles);
  } catch (err: any) {
    console.error("Erreur d'inscription :", err);

    const responseData = err.response?.data;

    // On vérifie si l'API a renvoyé un objet d'erreurs (422)
    if (responseData?.errors) {
      Object.keys(responseData.errors).forEach((key) => {
        const value = responseData.errors[key];
        errors[key] = Array.isArray(value) ? value[0] : value;
      });
    } else {
      // Erreur générale (ex: problème réseau, 500, etc.)
      emit(
        "error",
        responseData?.message || authStore.error || "Une erreur est survenue.",
      );
    }
  }
};
</script>
