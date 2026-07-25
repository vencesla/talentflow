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
          <div
            v-if="errorMessage"
            class="alert alert-danger rounded-3 mb-4"
            role="alert"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>

          <!-- INSCRIPTION -->
          <div v-if="mode === 'inscription'">
            <h3 class="fw-bold text-dark mb-1">Créez votre compte</h3>
            <p class="text-muted small mb-4">
              Accédez à des milliers d'offres adaptées à votre profil.
            </p>

            <label
              class="form-label fw-semibold text-secondary small text-uppercase tracking-wider"
              >Vous êtes ?</label
            >
            <div
              class="role-selector d-flex p-1 bg-light rounded-3 mb-4 border"
            >
              <button
                type="button"
                class="btn flex-fill py-2 fw-semibold rounded-2 border-0 btn-sm transition-all"
                :class="
                  selectedRole === 'ROLE_CANDIDATE'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted'
                "
                @click="selectedRole = 'ROLE_CANDIDATE'"
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
                @click="selectedRole = 'ROLE_RECRUITER'"
              >
                💼 Recruteur
              </button>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium small text-secondary"
                    >Prénom</label
                  >
                  <input
                    v-model="registerForm.firstName"
                    type="text"
                    class="form-control rounded-3"
                    placeholder="Jean"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium small text-secondary"
                    >Nom</label
                  >
                  <input
                    v-model="registerForm.lastName"
                    type="text"
                    class="form-control rounded-3"
                    placeholder="Dupont"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium small text-secondary"
                    >Adresse email</label
                  >
                  <input
                    v-model="registerForm.email"
                    type="email"
                    class="form-control rounded-3"
                    placeholder="jean.dupont@example.com"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium small text-secondary"
                    >Mot de passe</label
                  >
                  <input
                    v-model="registerForm.password"
                    type="password"
                    class="form-control rounded-3"
                    placeholder="8 caractères minimum"
                    required
                  />
                </div>

                <div class="col-12 mt-4 text-center">
                  <button
                    type="submit"
                    class="btn rounded-pill fw-bold text-white px-4 py-2 shadow-sm"
                    :class="
                      selectedRole === 'ROLE_CANDIDATE'
                        ? 'btn-primary'
                        : 'btn-purple'
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

          <!-- CONNEXION -->
          <div v-else>
            <h3 class="fw-bold text-dark mb-1">Bon retour parmi nous</h3>
            <p class="text-muted small mb-4">
              Connectez-vous pour suivre vos candidatures ou vos recrutements.
            </p>

            <form @submit.prevent="handleLogin">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-medium small text-secondary"
                    >Adresse email</label
                  >
                  <input
                    v-model="loginForm.email"
                    type="email"
                    class="form-control rounded-3"
                    placeholder="jean.dupont@example.com"
                    required
                  />
                </div>
                <div class="col-12">
                  <div
                    class="d-flex justify-content-between align-items-center mb-1"
                  >
                    <label
                      class="form-label fw-medium small text-secondary mb-0"
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
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div class="col-12 mt-4 text-center">
                  <button
                    type="submit"
                    class="btn btn-primary rounded-pill fw-bold text-white px-4 py-2 shadow-sm"
                    :disabled="authStore.loading"
                  >
                    <span
                      v-if="authStore.loading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    Se connecter
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="card-footer bg-light border-0 text-center py-3">
          <span v-if="mode === 'inscription'" class="small text-muted">
            Déjà inscrit(e) ?
            <a
              href="#connexion"
              @click.prevent="switchTab('connexion')"
              class="fw-bold text-primary text-decoration-none"
              >Se connecter</a
            >
          </span>
          <span v-else class="small text-muted">
            Pas encore de compte ?
            <a
              href="#inscription"
              @click.prevent="switchTab('inscription')"
              class="fw-bold text-primary text-decoration-none"
              >S'inscrire</a
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { redirectUserByRole } from "@/utils/navigation";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const mode = ref<"inscription" | "connexion">("inscription");
const selectedRole = ref<"ROLE_CANDIDATE" | "ROLE_RECRUITER">("ROLE_CANDIDATE");

const registerForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const loginForm = ref({
  email: "",
  password: "",
});

const errorMessage = ref("");

const syncModeFromHash = () => {
  const hash = route.hash.replace("#", "");
  if (hash === "connexion") {
    mode.value = "connexion";
  } else {
    mode.value = "inscription";
  }
};

const switchTab = (newMode: "inscription" | "connexion") => {
  mode.value = newMode;
  errorMessage.value = "";
  router.replace({ hash: `#${newMode}` });
};

watchEffect(() => {
  if (mode.value === "inscription") {
    document.title = "Inscription | talentflow";
  } else {
    document.title = "Connexion | talentflow";
  }
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

// 1. INSCRIPTION
const handleRegister = async () => {
  errorMessage.value = "";
  try {
    const user = await authStore.register({
      ...registerForm.value,
      roles: [selectedRole.value],
    });

    // Redirection automatique basée sur les rôles renvoyés
    await redirectUserByRole(user.roles, router);
  } catch (err: any) {
    console.error("Erreur lors de l'inscription :", err);
    if (err.response?.data?.email) {
      errorMessage.value = err.response.data.email[0];
    } else if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value =
        authStore.error || "Une erreur est survenue lors de l'inscription.";
    }
  }
};

// 2. CONNEXION JWT
const handleLogin = async () => {
  errorMessage.value = "";
  try {
    // Transmet bien l'objet complet { email, password } pour le JWT /login_check
    await authStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    if (authStore.currentUser) {
      await redirectUserByRole(authStore.currentUser.roles, router);
    }
  } catch (err: any) {
    console.error("Erreur de connexion :", err);
    if (err.response?.status === 401) {
      errorMessage.value = "Email ou mot de passe incorrect.";
    } else {
      errorMessage.value =
        authStore.error || "Impossible de se connecter au serveur.";
    }
  }
};
</script>
