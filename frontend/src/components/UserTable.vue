<!-- src/components/user/UserTable.vue -->
<script setup lang="ts">
import type { ApiUser } from "@/schemas/user.schema";

// 1. On définit la prop avec une valeur par défaut de tableau vide []
interface Props {
  users?: ApiUser[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => [],
  loading: false,
});

defineEmits<{
  (e: "edit", user: ApiUser): void;
  (e: "delete", id: number): void;
}>();
</script>

<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- État de chargement -->
        <tr v-if="loading">
          <td colspan="5" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </td>
        </tr>

        <!-- 2. Utilisation du chaînage optionnel ?. / fallback -->
        <tr v-else-if="!users || users.length === 0">
          <td colspan="5" class="text-center py-4 text-muted">
            Aucun utilisateur trouvé.
          </td>
        </tr>

        <!-- Affichage de la liste -->
        <tr v-else v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <!-- <td>
            <span class="badge bg-secondary">{{
              user.role || "Utilisateur"
            }}</span>
          </td> -->
          <td class="text-end">
            <button
              class="btn btn-sm btn-outline-primary me-2"
              @click="$emit('edit', user)"
            >
              Éditer
            </button>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="$emit('delete', user.id)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
