<!-- src/components/auth/RegisterForm.vue -->
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const userStore = useAuthStore();
const router = useRouter();

// Rôle sélectionné par défaut
const selectedRole = ref<"ROLE_CANDIDATE" | "ROLE_RECRUITER">("ROLE_CANDIDATE");

const formData = reactive({
  email: "",
  firstName: "",
  lastName: "",
});

const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";

  try {
    // Appel du store Pinia sans gestion de token
    await userStore.register({
      ...formData,
      roles: [selectedRole.value],
    });

    // Redirection automatique selon le rôle choisi
    if (selectedRole.value === "ROLE_CANDIDATE") {
      router.push("/candidate/dashboard");
    } else {
      router.push("/recruiter/dashboard");
    }
  } catch (err: any) {
    errorMessage.value =
      userStore.error || "Une erreur est survenue lors de l'inscription.";
  }
};
</script>

<template>
  <div class="card shadow-sm mx-auto" style="max-width: 500px">
    <div class="card-body p-4">
      <h3 class="card-title text-center mb-4">Créer un compte</h3>

      <!-- Onglets Candidat / Recruteur -->
      <div class="row g-2 mb-4">
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            :class="
              selectedRole === 'ROLE_CANDIDATE'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            "
            @click="selectedRole = 'ROLE_CANDIDATE'"
          >
            <span>👨‍🎓</span>
            <span>Candidat</span>
          </button>
        </div>
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            :class="
              selectedRole === 'ROLE_RECRUITER'
                ? 'btn-primary'
                : 'btn-outline-secondary'
            "
            @click="selectedRole = 'ROLE_RECRUITER'"
          >
            <span>💼</span>
            <span>Recruteur</span>
          </button>
        </div>
      </div>

      <!-- Alerte Erreur -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label">Prénom</label>
            <input
              v-model="formData.firstName"
              type="text"
              class="form-control"
              required
              placeholder="ex: Jean"
            />
          </div>

          <div class="col-6">
            <label class="form-label">Nom</label>
            <input
              v-model="formData.lastName"
              type="text"
              class="form-control"
              required
              placeholder="ex: Dupont"
            />
          </div>

          <div class="col-12">
            <label class="form-label">Adresse Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-control"
              required
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div class="col-12 mt-4">
            <button
              type="submit"
              class="btn btn-primary w-100 py-2"
              :disabled="userStore.loading"
            >
              <span
                v-if="userStore.loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              S'inscrire en tant que
              {{ selectedRole === "ROLE_CANDIDATE" ? "Candidat" : "Recruteur" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
