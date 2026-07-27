<template>
  <div class="position-relative">
    <div class="input-group">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control rounded-start-3"
        placeholder="Ville, département, région"
        :disabled="disabled"
        @input="onInput"
        @focus="showDropdown = suggestions.length > 0"
        @blur="handleBlur"
        @keydown.enter.prevent
      />
      <span v-if="isLoading" class="input-group-text bg-white">
        <span class="spinner-border spinner-border-sm text-primary"></span>
      </span>
    </div>

    <!-- Menu déroulant des suggestions -->
    <ul
      v-if="showDropdown && suggestions.length > 0"
      class="dropdown-menu show w-100 shadow-sm mt-1 overflow-auto"
      style="max-height: 220px; z-index: 1050"
    >
      <li v-for="(item, index) in suggestions" :key="index">
        <button
          type="button"
          class="dropdown-item py-2 d-flex align-items-center justify-content-between"
          @mousedown="selectLocation(item)"
        >
          <span>{{ item }}</span>
          <i class="bi bi-plus-circle text-primary small"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", location: string): void;
}>();

const searchQuery = ref("");
const suggestions = ref<string[]>([]);
const isLoading = ref(false);
const showDropdown = ref(false);
let debounceTimeout: NodeJS.Timeout;

const staticSuggestions = ["Télétravail (100%)", "Toute la France"];

const fetchSuggestions = async (query: string) => {
  if (query.trim().length < 2) {
    suggestions.value = [];
    return;
  }

  isLoading.value = true;
  try {
    // 1. Appel API pour les Villes
    const resCities = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,codeDepartement&limit=5`,
    );
    const cities = await resCities.json();

    // 2. Appel API pour les Départements
    const resDeps = await fetch(
      `https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(query)}&limit=3`,
    );
    const deps = await resDeps.json();

    // Formatting des résultats
    const formattedCities = cities.map(
      (c: any) => `${c.nom} (${c.codeDepartement})`,
    );
    const formattedDeps = deps.map(
      (d: any) => `Département ${d.nom} (${d.code})`,
    );

    // Filtre des options statiques si elles correspondent à la recherche
    const matchedStatic = staticSuggestions.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase()),
    );

    suggestions.value = [
      ...matchedStatic,
      ...formattedDeps,
      ...formattedCities,
    ];
    showDropdown.value = suggestions.value.length > 0;
  } catch (err) {
    console.error("Erreur API Geo :", err);
  } finally {
    isLoading.value = false;
  }
};

const onInput = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetchSuggestions(searchQuery.value);
  }, 300);
};

const selectLocation = (loc: string) => {
  emit("select", loc);
  searchQuery.value = "";
  suggestions.value = [];
  showDropdown.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>
