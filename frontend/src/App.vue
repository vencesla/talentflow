<script setup lang="ts">
import AppNavbar from "@/components/layout/AppNavbar.vue";
</script>

<template>
  <div class="min-vh-100 d-flex flex-column bg-light-subtle">
    <!-- Navbar supérieure HelloWork -->
    <AppNavbar />

    <!-- Contenu dynamique des pages -->
    <main class="flex-grow-1">
      <router-view />
    </main>
  </div>
</template>
