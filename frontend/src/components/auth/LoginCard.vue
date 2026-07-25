<template>
  <div class="card shadow-sm border-0 rounded-3">
    <div class="card-body p-4 p-sm-5">
      <!-- Header -->
      <div class="text-center mb-4">
        <h1 class="h3 fw-bold text-primary">TalentFlow</h1>
        <p class="text-muted small">Connectez-vous à votre espace personnel</p>
      </div>

      <!-- Erreur -->
      <div
        v-if="errorMessage"
        class="alert alert-danger d-flex align-items-center mb-4"
        role="alert"
      >
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        <div>{{ errorMessage }}</div>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="login-email" class="form-label fw-semibold"
            >Adresse e-mail</label
          >
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="fa-solid fa-envelope text-muted"></i>
            </span>
            <input
              id="login-email"
              v-model.trim="credentials.email"
              type="email"
              class="form-control bg-light border-start-0"
              placeholder="nom@exemple.com"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="login-password" class="form-label fw-semibold"
            >Mot de passe</label
          >
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="fa-solid fa-lock text-muted"></i>
            </span>
            <input
              id="login-password"
              v-model="credentials.password"
              type="password"
              class="form-control bg-light border-start-0"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 fw-semibold"
          :disabled="authStore.loading"
        >
          <span
            v-if="authStore.loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          <span>{{ authStore.loading ? "Connexion..." : "Se connecter" }}</span>
        </button>
      </form>

      <!-- Basculement vers l'inscription -->
      <div class="text-center mt-4 pt-3 border-top">
        <p class="small text-muted mb-0">
          Vous n'avez pas encore de compte ?
          <button
            type="button"
            class="btn btn-link text-primary text-decoration-none p-0 fw-semibold align-baseline"
            @click="emit('switchToRegister')"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits(["switchToRegister"]);

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: "",
  password: "",
});

const errorMessage = ref<string | null>(null);

const handleLogin = async () => {
  errorMessage.value = null;

  try {
    await authStore.login(credentials.value);

    // Redirection dynamique basée sur le rôle
    if (authStore.isCandidate) {
      await router.push("/candidate/dashboard");
    } else if (authStore.isRecruiter) {
      await router.push("/recruiter/dashboard");
    } else if (authStore.isAdmin) {
      await router.push("/admin/dashboard");
    } else {
      await router.push("/");
    }
  } catch (err: any) {
    if (err.response?.status === 401) {
      errorMessage.value = "Email ou mot de passe incorrect.";
    } else {
      errorMessage.value = "Problème de connexion avec le serveur.";
    }
  }
};
</script>
