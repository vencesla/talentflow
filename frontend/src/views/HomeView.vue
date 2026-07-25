<template>
  <div class="home-page">
    <!-- 🎯 SECTION HERO (RECHERCHE PRINCIPALE) -->
    <section
      class="hero-section bg-primary text-white py-5 position-relative overflow-hidden"
    >
      <div class="container py-4 py-lg-5">
        <div class="row justify-content-center text-center mb-4">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold mb-3">
              Trouvez le job qui vous convient vraiment
            </h1>
            <p class="lead opacity-90 mb-0">
              Des milliers d'offres d'emploi mises à jour chaque jour partout en
              France.
            </p>
          </div>
        </div>

        <!-- BARRE DE RECHERCHE -->
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div
              class="card border-0 shadow-lg rounded-4 p-3 bg-white text-dark"
            >
              <form
                @submit.prevent="handleSearch"
                class="row g-2 align-items-center"
              >
                <!-- Champ Métier / Mot-clé -->
                <div class="col-md-5">
                  <div class="input-group">
                    <span
                      class="input-group-text bg-transparent border-0 text-muted fs-5"
                    >
                      <i class="bi bi-search"></i>
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control border-0 shadow-none fs-6"
                      placeholder="Métier, compétences, entreprise..."
                    />
                  </div>
                </div>

                <div class="col-md-1 d-none d-md-block text-center text-muted">
                  <div class="vr h-100"></div>
                </div>

                <!-- Champ Localisation -->
                <div class="col-md-4">
                  <div class="input-group">
                    <span
                      class="input-group-text bg-transparent border-0 text-muted fs-5"
                    >
                      <i class="bi bi-geo-alt"></i>
                    </span>
                    <input
                      v-model="locationQuery"
                      type="text"
                      class="form-control border-0 shadow-none fs-6"
                      placeholder="Ville, département, région"
                    />
                  </div>
                </div>

                <!-- Bouton Recherche -->
                <div class="col-md-2">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 rounded-3 fw-bold"
                  >
                    Rechercher
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🎯 SECTION ACCÈS RAPIDE SELON STATUT/RÔLE -->
    <section class="py-5 bg-light-subtle">
      <div class="container py-3">
        <!-- Si l'utilisateur est connecté -->
        <div
          v-if="authStore.isAuthenticated"
          class="alert bg-white border shadow-sm rounded-4 p-4 text-center"
        >
          <h4 class="fw-bold mb-2">
            Bienvenue, {{ authStore.currentUser?.firstName }} ! 👋
          </h4>
          <p class="text-muted mb-3">
            Vous êtes connecté en tant que
            <strong class="text-capitalize">{{
              authStore.isCandidate ? "Candidat" : "Recruteur"
            }}</strong
            >.
          </p>
          <router-link
            :to="
              authStore.isCandidate
                ? '/candidate/dashboard'
                : '/recruiter/dashboard'
            "
            class="btn rounded-pill px-4 fw-bold text-white"
            :class="authStore.isCandidate ? 'btn-primary' : 'btn-purple'"
          >
            Accéder à mon espace
            {{ authStore.isCandidate ? "Candidat" : "Recruteur" }}
          </router-link>
        </div>

        <!-- Si l'utilisateur est visiteur (Non connecté) -->
        <div v-else class="row g-4 text-center">
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm rounded-4 p-4">
              <div class="card-body d-flex flex-column align-items-center">
                <div class="fs-1 text-primary mb-3">👨‍🎓</div>
                <h3 class="fw-bold fs-4">Vous cherchez un emploi ?</h3>
                <p class="text-muted small flex-grow-1">
                  Créez votre profil candidat en 2 minutes, postulez en un clic
                  et suivez vos candidatures.
                </p>
                <router-link
                  to="/connexion-inscription.html#inscription"
                  class="btn btn-outline-primary rounded-pill fw-bold px-4"
                >
                  Créer un compte candidat
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm rounded-4 p-4">
              <div class="card-body d-flex flex-column align-items-center">
                <div class="fs-1 text-purple mb-3">💼</div>
                <h3 class="fw-bold fs-4">Vous êtes un recruteur ?</h3>
                <p class="text-muted small flex-grow-1">
                  Publiez vos offres d'emploi, gérez vos candidatures et trouvez
                  les meilleurs talents.
                </p>
                <router-link
                  to="/auth#inscription"
                  class="btn btn-outline-purple rounded-pill fw-bold px-4"
                >
                  Espace Recruteur
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

// Formulaire de recherche
const searchQuery = ref("");
const locationQuery = ref("");

const handleSearch = () => {
  // Redirige vers la liste des offres avec les filtres en query params
  router.push({
    path: "/jobs",
    query: {
      q: searchQuery.value,
      location: locationQuery.value,
    },
  });
};
</script>
