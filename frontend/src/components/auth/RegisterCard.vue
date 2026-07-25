<template>
  <div class="card shadow-sm border-0 rounded-3">
    <div class="card-body p-4 p-sm-5">
      <!-- Header -->
      <div class="text-center mb-4">
        <h1 class="h3 fw-bold text-primary">Rejoindre TalentFlow</h1>
        <p class="text-muted small">Créez votre compte en quelques secondes</p>
      </div>

      <!-- Message d'erreur -->
      <div
        v-if="errorMessage"
        class="alert alert-danger d-flex align-items-center mb-4"
        role="alert"
      >
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        <div>{{ errorMessage }}</div>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleRegister">
        <!-- Sélection du rôle -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Vous êtes :</label>
          <div class="row g-2">
            <div class="col-6">
              <input
                type="radio"
                class="btn-check"
                name="role-options"
                id="role-candidate"
                value="ROLE_CANDIDATE"
                v-model="registerForm.roles[0]"
              />
              <label
                class="btn btn-outline-primary w-100 py-2"
                for="role-candidate"
              >
                <i class="fa-solid fa-user me-1"></i> Candidat
              </label>
            </div>
            <div class="col-6">
              <input
                type="radio"
                class="btn-check"
                name="role-options"
                id="role-recruiter"
                value="ROLE_RECRUITER"
                v-model="registerForm.roles[0]"
              />
              <label
                class="btn btn-outline-primary w-100 py-2"
                for="role-recruiter"
              >
                <i class="fa-solid fa-briefcase me-1"></i> Recruteur
              </label>
            </div>
          </div>
        </div>

        <!-- Prénom & Nom -->
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label for="reg-firstname" class="form-label fw-semibold"
              >Prénom</label
            >
            <input
              id="reg-firstname"
              v-model.trim="registerForm.firstName"
              type="text"
              class="form-control bg-light"
              placeholder="Jean"
              required
            />
          </div>
          <div class="col-6">
            <label for="reg-lastname" class="form-label fw-semibold">Nom</label>
            <input
              id="reg-lastname"
              v-model.trim="registerForm.lastName"
              type="text"
              class="form-control bg-light"
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="reg-email" class="form-label fw-semibold"
            >Adresse e-mail</label
          >
          <input
            id="reg-email"
            v-model.trim="registerForm.email"
            type="email"
            class="form-control bg-light"
            placeholder="nom@exemple.com"
            required
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-4">
          <label for="reg-password" class="form-label fw-semibold"
            >Mot de passe</label
          >
          <input
            id="reg-password"
            v-model="registerForm.password"
            type="password"
            class="form-control bg-light"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 fw-semibold"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          <span>{{ isSubmitting ? "Création..." : "Créer mon compte" }}</span>
        </button>
      </form>

      <!-- Basculement vers la connexion -->
      <div class="text-center mt-4 pt-3 border-top">
        <p class="small text-muted mb-0">
          Vous avez déjà un compte ?
          <button
            type="button"
            class="btn btn-link text-primary text-decoration-none p-0 fw-semibold align-baseline"
            @click="emit('switchToLogin')"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits(["switchToLogin"]);

const router = useRouter();
const authStore = useAuthStore();

const registerForm = ref({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  roles: ["ROLE_CANDIDATE"], // Rôle par défaut dans le formulaire
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const handleRegister = async () => {
  errorMessage.value = null;
  isSubmitting.value = true;

  try {
    // 1. Appel API d'inscription
    await api.post("/user", registerForm.value);

    // 2. Auto-connexion après inscription réussie
    await authStore.login({
      email: registerForm.value.email,
      password: registerForm.value.password,
    });

    // 3. Redirection selon le rôle choisi
    if (authStore.isCandidate) {
      await router.push("/candidate/dashboard");
    } else if (authStore.isRecruiter) {
      await router.push("/recruiter/dashboard");
    }
  } catch (err: any) {
    if (err.response?.status === 422) {
      errorMessage.value =
        err.response.data.message || "Données invalides ou email déjà utilisé.";
    } else {
      errorMessage.value = "Une erreur est survenue lors de l'inscription.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
