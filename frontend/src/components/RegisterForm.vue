<!-- src/components/auth/RegisterForm.vue -->
<script setup lang="ts">
import { ref, reactive } from "vue";
import { registerSchema } from "@/schemas/user.schema";
import { useAuthStore } from "@/stores/authStore"; // Ton store d'authentification

const userStore = useAuthStore();

// Rôle sélectionné par défaut : Candidat
const selectedRole = ref<"ROLE_CANDIDATE" | "ROLE_RECRUITER">("ROLE_CANDIDATE");

const formData = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
});

const errors = ref<Record<string, string>>({});

const handleSubmit = async () => {
  errors.value = {};

  // 1. Préparation des données avec le rôle injecté automatiquement
  const payload = {
    ...formData,
    role: selectedRole.value,
  };

  // 2. Validation Zod
  const result = registerSchema.safeParse(payload);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message;
      }
    });
    return;
  }

  // 3. Envoi au backend (le backend recevra roles: [selectedRole.value])
  try {
    await userStore.register({
      ...result.data,
      roles: [result.data.roles[0]],
    });
  } catch (err: any) {
    console.error("Erreur lors de l'inscription", err);
  }
};
</script>

<template>
  <div class="card shadow-sm mx-auto" style="max-width: 500px">
    <div class="card-body p-4">
      <h3 class="card-title text-center mb-4">Créer un compte</h3>

      <!-- 🎯 ONGLETS DE SÉLECTION DU RÔLE -->
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

      <!-- FORMULAIRE -->
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="row g-3">
          <!-- Prénom -->
          <div class="col-6">
            <label class="form-label">Prénom</label>
            <input
              v-model="formData.firstName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.firstName }"
              placeholder="ex: Jean"
            />
            <div v-if="errors.firstName" class="invalid-feedback">
              {{ errors.firstName }}
            </div>
          </div>

          <!-- Nom -->
          <div class="col-6">
            <label class="form-label">Nom</label>
            <input
              v-model="formData.lastName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
              placeholder="ex: Dupont"
            />
            <div v-if="errors.lastName" class="invalid-feedback">
              {{ errors.lastName }}
            </div>
          </div>

          <!-- Email -->
          <div class="col-12">
            <label class="form-label">Adresse Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              placeholder="jean.dupont@example.com"
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="col-12">
            <label class="form-label">Mot de passe</label>
            <input
              v-model="formData.password"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
            />
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>

          <!-- Bouton de soumission -->
          <div class="col-12 mt-4">
            <button type="submit" class="btn btn-primary w-100 py-2">
              S'inscrire en tant que
              {{ selectedRole === "ROLE_CANDIDATE" ? "Candidat" : "Recruteur" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
