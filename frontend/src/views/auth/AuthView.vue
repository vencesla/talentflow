<template>
  <div
    class="auth-page py-5 bg-light-subtle min-vh-100 d-flex align-items-center"
  >
    <div class="container" style="max-width: 640px">
      <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <!-- ONGLETS -->
        <div class="card-header bg-white border-bottom p-0 d-flex">
          <button
            type="button"
            class="btn flex-fill py-3 fs-5 fw-bold border-0 rounded-0 tab-link"
            :class="{ active: mode === 'inscription' }"
            @click="switchTab('inscription')"
          >
            S'inscrire
          </button>
          <button
            type="button"
            class="btn flex-fill py-3 fs-5 fw-bold border-0 rounded-0 tab-link"
            :class="{ active: mode === 'connexion' }"
            @click="switchTab('connexion')"
          >
            Se connecter
          </button>
        </div>

        <div class="card-body p-4 p-md-5">
          <!-- Affichage Erreur unique -->
          <div
            v-if="errorMessage"
            class="alert alert-danger rounded-3 mb-4"
            role="alert"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Formulaires sous forme de composants isolés -->
          <RegisterForm
            v-if="mode === 'inscription'"
            @success="handleAuthSuccess"
            @error="handleAuthError"
          />

          <LoginForm
            v-else
            @success="handleAuthSuccess"
            @error="handleAuthError"
          />
        </div>

        <!-- FOOTER SWITCH -->
        <div class="card-footer bg-light border-0 text-center py-3">
          <span v-if="mode === 'inscription'" class="small text-muted">
            Déjà inscrit(e) ?
            <a
              href="#connexion"
              @click.prevent="switchTab('connexion')"
              class="fw-bold text-primary text-decoration-none"
            >
              Se connecter
            </a>
          </span>
          <span v-else class="small text-muted">
            Pas encore de compte ?
            <a
              href="#inscription"
              @click.prevent="switchTab('inscription')"
              class="fw-bold text-primary text-decoration-none"
            >
              S'inscrire
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { redirectUserByRole } from "@/utils/navigation";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import LoginForm from "@/components/auth/LoginForm.vue";

const route = useRoute();
const router = useRouter();

const mode = ref<"inscription" | "connexion">("inscription");
const errorMessage = ref("");

const syncModeFromHash = () => {
  const hash = route.hash.replace("#", "");
  mode.value = hash === "connexion" ? "connexion" : "inscription";
};

const switchTab = (newMode: "inscription" | "connexion") => {
  mode.value = newMode;
  errorMessage.value = "";
  router.replace({ hash: `#${newMode}` });
};

watchEffect(() => {
  document.title =
    mode.value === "inscription"
      ? "Inscription | talentflow"
      : "Connexion | talentflow";
});

onMounted(() => {
  syncModeFromHash();
});

watch(
  () => route.hash,
  () => {
    syncModeFromHash();
  },
);

// Callback quand l'une des actions réussit
const handleAuthSuccess = async (roles: string[]) => {
  await redirectUserByRole(roles, router);
};

// Callback pour centraliser l'affichage de l'erreur
const handleAuthError = (msg: string) => {
  errorMessage.value = msg;
};
</script>
