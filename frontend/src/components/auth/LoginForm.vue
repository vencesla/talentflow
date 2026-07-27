<template>
  <div>
    <div
      class="profil p-2 p-md-4 rounded-4 mb-4 text-center border border-primary-subtle shadow-sm"
    >
      <h5 class="text-muted small mb-4">
        Ravi de vous retrouver sur TalentFlow !<br />
        Retrouvez toutes vos offres et candidatures en vous connectant :
      </h5>
    </div>

    <form @submit.prevent="handleLogin" novalidate>
      <div class="row g-3">
        <!-- Email -->
        <div class="col-12 text-start">
          <label class="form-label fw-medium small text-secondary"
            >Adresse email</label
          >
          <input
            v-model="loginForm.email"
            type="email"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
          />
          <div
            v-if="errors.email && errors.email.trim()"
            class="invalid-feedback d-block"
          >
            {{ errors.email }}
          </div>
        </div>

        <!-- Mot de passe -->
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label fw-medium small text-secondary mb-0"
              >Mot de passe</label
            >
            <a href="#" class="small text-primary text-decoration-none"
              >Mot de passe oublié ?</a
            >
          </div>
          <input
            v-model="loginForm.password"
            type="password"
            class="form-control rounded-3"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
          />
          <div v-if="errors.password" class="invalid-feedback d-block">
            {{ errors.password }}
          </div>
        </div>

        <!-- Soumettre -->
        <div class="col-12 mt-4 text-center">
          <button
            type="submit"
            class="btn btn-primary rounded-pill fw-bold text-white px-4 py-2 shadow-sm d-inline-flex align-items-center justify-content-center"
            :disabled="authStore.loading"
          >
            <span
              v-if="authStore.loading"
              class="spinner-border spinner-border-sm me-2 text-white"
            ></span>
            <span>{{
              authStore.loading ? "Connexion..." : "Se connecter"
            }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits<{
  (e: "success", roles: string[]): void;
  (e: "error", message: string): void;
}>();

const authStore = useAuthStore();

const loginForm = ref({
  email: "",
  password: "",
});

const errors = reactive<Record<string, string>>({});

const clearError = (field: string) => {
  delete errors[field];
  emit("error", "");
};

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (!loginForm.value.email.trim()) {
    errors.email = "Merci de saisir votre email.";
    isValid = false;
  }

  if (!loginForm.value.password) {
    errors.password = "Merci de saisir votre mot de passe.";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    if (authStore.currentUser) {
      emit("success", authStore.currentUser.roles);
    }
  } catch (err: any) {
    console.error("Erreur de connexion :", err);
    if (err.response?.status === 401) {
      errors.email = " ";
      errors.password = "Email ou mot de passe incorrect.";
    } else {
      emit(
        "error",
        authStore.error || "Impossible de se connecter au serveur.",
      );
    }
  }
};
</script>
