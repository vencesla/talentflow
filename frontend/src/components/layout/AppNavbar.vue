<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm"
  >
    <div class="container">
      <!-- 1. LOGO BRANDING -->
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <div class="bg-primary text-white rounded-3 px-2 py-1 fw-bold fs-4">
          TF
        </div>
        <span class="fw-bold fs-4 text-dark tracking-tight"
          >Talent<span class="text-primary">Flow</span></span
        >
      </router-link>

      <!-- Bouton Mobile Toggle -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarHelloWork"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 2. LIENS DE NAVIGATION (CENTRE/GAUCHE) -->
      <div class="collapse navbar-collapse" id="navbarHelloWork">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2 fw-medium">
          <li class="nav-item">
            <router-link
              class="nav-link text-secondary"
              active-class="text-primary fw-semibold"
              to="/jobs"
            >
              Offres d'emploi
            </router-link>
          </li>

          <!-- Liens spécifiques Candidat -->
          <template v-if="authStore.isCandidate">
            <li class="nav-item">
              <router-link
                class="nav-link text-secondary"
                active-class="text-primary fw-semibold"
                to="/candidate/applications"
              >
                Mes candidatures
              </router-link>
            </li>
          </template>

          <!-- Liens spécifiques Recruteur -->
          <template v-if="authStore.isRecruiter">
            <li class="nav-item">
              <router-link
                class="nav-link text-secondary"
                active-class="text-primary fw-semibold"
                to="/recruiter/dashboard"
              >
                Espace Recruteur
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-secondary"
                active-class="text-primary fw-semibold"
                to="/recruiter/jobs/new"
              >
                Publier une offre
              </router-link>
            </li>
          </template>
        </ul>

        <!-- 3. BOUTON DÉROULANT ESPACE COMPTE / CONNEXION (DROITE) -->
        <div class="d-flex align-items-center gap-3">
          <!-- Si déconnecté : Dropdown "Se connecter / S'inscrire" -->
          <div v-if="!authStore.isAuthenticated" class="dropdown">
            <button
              class="btn btn-outline-primary rounded-pill px-4 dropdown-toggle fw-semibold d-flex align-items-center gap-2"
              type="button"
              id="authDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle fs-5"></i>
              <span>Se connecter</span>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2"
              aria-labelledby="authDropdown"
              style="min-width: 30px"
            >
              <li>
                <router-link
                  class="dropdown-item rounded-3 d-flex align-items-center gap-1 small"
                  to="/connexion-inscription.html#connexion"
                >
                  Connexion
                </router-link>
              </li>
              <li><hr class="dropdown-divider my-1" /></li>
              <li>
                <router-link
                  class="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 small"
                  to="/connexion-inscription.html#inscription"
                >
                  Créer un compte
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Si connecté : Menu Utilisateur personnalisé -->
          <div v-else class="d-flex align-items-center gap-2">
            <router-link
              to="/jobs"
              class="btn btn-light rounded-circle d-flex align-items-center justify-content-center text-secondary border-0 p-0"
              style="width: 36px; height: 36px"
              title="Rechercher des offres d'emploi"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </router-link>

            <div class="dropdown">
              <button
                class="btn btn-transparent px-3 py-1 border-0 dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <!-- Avatar initiales -->
                <div
                  class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style="width: 32px; height: 32px; font-size: 0.85rem"
                >
                  {{ authStore.currentUser?.firstName?.charAt(0)
                  }}{{ authStore.currentUser?.lastName?.charAt(0) }}
                </div>
              </button>

              <ul
                class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2"
                aria-labelledby="userMenu"
                style="min-width: 240px"
              >
                <!-- En-tête du profil avec badge de rôle -->
                <li class="px-3 py-2 bg-light rounded-3 mb-2">
                  <!-- Avatar initiales -->
                  <div
                    class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold mb-2"
                    style="width: 60px; height: 60px; font-size: 1.5rem"
                  >
                    {{ authStore.currentUser?.firstName?.charAt(0)
                    }}{{ authStore.currentUser?.lastName?.charAt(0) }}
                  </div>
                  <div class="fw-bold text-dark fs-6">
                    {{ authStore.currentUser?.firstName }}
                    {{ authStore.currentUser?.lastName }}
                  </div>
                  <div class="small text-muted mb-1">
                    {{ authStore.currentUser?.email }}
                  </div>
                </li>

                <li><hr class="dropdown-divider my-1" /></li>
                <li>
                  <button
                    @click="handleLogout"
                    class="dropdown-item rounded-2 py-2 text-secondary d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-box-arrow-right"></i>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
            <!-- end-->
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Un brin de finition visuelle style HelloWork */
.dropdown-item:active {
  background-color: var(--bs-primary);
  color: white;
}
.bg-purple {
  background-color: #6f42c1;
}
</style>
