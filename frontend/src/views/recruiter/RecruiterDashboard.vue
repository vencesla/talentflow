<template>
  <div class="dashboard-container">
    <!-- Header Dashboard -->
    <header class="dashboard-header">
      <div class="company-info" v-if="companyStore.company">
        <div class="logo-wrapper">
          <img
            v-if="companyStore.company.logoUrl"
            :src="companyStore.company.logoUrl"
            :alt="companyStore.company.name"
            class="logo"
          />
          <div v-else class="logo-placeholder">
            {{ companyStore.company.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div>
          <h1>{{ companyStore.company.name }}</h1>
          <p class="siret">SIRET : {{ companyStore.company.siret }}</p>
        </div>
      </div>

      <button @click="goToCreateOffer" class="btn-primary">
        + Déposer une offre
      </button>
    </header>

    <!-- Statistiques rapides -->
    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{
          offers.filter((o) => o.status === "ACTIVE").length
        }}</span>
        <span class="stat-label">Offres actives</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">
          {{ offers.reduce((acc, o) => acc + o.applicationsCount, 0) }}
        </span>
        <span class="stat-label">Candidatures reçues</span>
      </div>
    </section>

    <!-- Liste des offres d'emploi -->
    <section class="content-section">
      <div class="section-header">
        <h2>Vos offres d'emploi</h2>
      </div>

      <div v-if="loadingOffers" class="loading-state">
        Chargement de vos offres...
      </div>

      <div v-else-if="offers.length === 0" class="empty-state">
        <p>Vous n'avez pas encore publié d'offre d'emploi.</p>
        <button @click="goToCreateOffer" class="btn-secondary">
          Créer votre première offre
        </button>
      </div>

      <div v-else class="offers-list">
        <div v-for="offer in offers" :key="offer.id" class="offer-card">
          <div class="offer-details">
            <div class="title-row">
              <h3>{{ offer.title }}</h3>
              <span :class="['badge', getStatusBadgeClass(offer.status)]">
                {{ translateStatus(offer.status) }}
              </span>
            </div>
            <div class="meta-row">
              <span>{{ offer.contractType }}</span>
              <span>•</span>
              <span>{{ offer.location }}</span>
              <span>•</span>
              <span>Créée le {{ offer.createdAt }}</span>
            </div>
          </div>

          <div class="offer-actions">
            <div class="applications-count">
              <strong>{{ offer.applicationsCount }}</strong> candidatures
            </div>
            <button class="btn-outline">Gérer</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import "@/assets/css/company.recru.css";

const router = useRouter();
const authStore = useAuthStore();
const companyStore = useCompanyStore();

// Structure locale simulée ou issue de ton jobOfferStore
interface JobOfferItem {
  id: number;
  title: string;
  contractType: string;
  location: string;
  status: "ACTIVE" | "DRAFT" | "CLOSED";
  applicationsCount: number;
  createdAt: string;
}

const offers = ref<JobOfferItem[]>([]);
const loadingOffers = ref(true);

onMounted(async () => {
  // Charger les données de l'entreprise si non encore en mémoire
  if (!companyStore.company && authStore.currentUser?.hasCompany) {
    await companyStore.fetchMyCompany();
  }

  // Simulation d'appel API pour les offres de l'entreprise
  // (À remplacer par un appel à ton jobOfferStore / jobOfferRepository)
  setTimeout(() => {
    offers.value = [
      {
        id: 1,
        title: "Développeur Fullstack Vue.js / Symfony",
        contractType: "CDI",
        location: "Paris (Hybride)",
        status: "ACTIVE",
        applicationsCount: 8,
        createdAt: "2026-07-15",
      },
      {
        id: 2,
        title: "Lead Tech Frontend",
        contractType: "CDI",
        location: "Nantes",
        status: "DRAFT",
        applicationsCount: 0,
        createdAt: "2026-07-22",
      },
    ];
    loadingOffers.value = false;
  }, 400);
});

function goToCreateOffer() {
  router.push({ name: "create-job-offer" });
}

function getStatusBadgeClass(status: JobOfferItem["status"]) {
  switch (status) {
    case "ACTIVE":
      return "badge-active";
    case "DRAFT":
      return "badge-draft";
    case "CLOSED":
      return "badge-closed";
  }
}

function translateStatus(status: JobOfferItem["status"]) {
  switch (status) {
    case "ACTIVE":
      return "Publiée";
    case "DRAFT":
      return "Brouillon";
    case "CLOSED":
      return "Clôturée";
  }
}
</script>
