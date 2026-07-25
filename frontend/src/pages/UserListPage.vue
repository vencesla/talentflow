<!-- src/pages/UserListPage.vue -->
<template>
  <div class="container py-4">
    <!-- En-tête -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">Gestion des Utilisateurs</h1>
        <p class="text-muted mb-0">Gérez les comptes et les accès TalentFlow</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        + Nouvel Utilisateur
      </button>
    </div>

    <!-- Feedback Chargement / Erreur -->
    <div v-if="userStore.loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="userStore.error" class="alert alert-danger">
      {{ userStore.error }}
    </div>

    <!-- Tableau réutilisable -->
    <UserTable
      v-else
      :users="userStore.users"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modal d'édition/création réutilisable -->
    <BaseModal
      :is-open="isModalOpen"
      :title="editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'"
      @close="closeModal"
    >
      <!-- Formulaire inséré via le slot -->
      <p class="text-muted">Formulaire de données à insérer ici...</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ApiUser } from "@/schemas/user.schema";
import { useAuthStore } from "@/stores/authStore";
import BaseModal from "@/components/common/BaseModal.vue";
import UserTable from "@/components/UserTable.vue";

const userStore = useAuthStore();
const isModalOpen = ref(false);
const editingUser = ref<ApiUser | null>(null);

onMounted(() => {
  userStore.fetchUsers();
});

const openCreateModal = () => {
  editingUser.value = null;
  isModalOpen.value = true;
};

const handleEdit = (user: ApiUser) => {
  editingUser.value = user;
  isModalOpen.value = true;
};

const handleDelete = async (id: number) => {
  if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
    await userStore.deleteUser(id);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>
