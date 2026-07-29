import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "TalentFlow - Emploi et Recrutement" },
    },
    {
      path: "/connexion-inscription.html",
      name: "auth",
      component: () => import("@/views/auth/AuthView.vue"),
      meta: { title: "Connexion / Inscription" },
    },
    { path: "/login", redirect: { name: "auth", hash: "#connexion" } },
    {
      path: "/user/register",
      redirect: { name: "auth", hash: "#inscription" },
    },

    // Recruteur
    {
      path: "/recruiter/onboarding",
      name: "recruiter-onboarding",
      component: () => import("@/views/CompanyProfileView.vue"),
      meta: {
        requiresAuth: true,
        role: "ROLE_RECRUITER",
        title: "Création de votre entreprise",
      },
    },
    {
      path: "/recruiter/dashboard",
      name: "recruiter-dashboard",
      component: () => import("@/views/recruiter/RecruiterDashboard.vue"),
      meta: {
        requiresAuth: true,
        role: "ROLE_RECRUITER",
        title: "Dashboard Recruteur",
      },
    },

    // Candidat
    {
      path: "/candidate/dashboard",
      name: "candidate-dashboard",
      component: () => import("@/views/candidate/DashboardView.vue"),
      meta: {
        requiresAuth: true,
        role: "ROLE_CANDIDATE",
        title: "Dashboard Candidat",
      },
    },

    // Fallback
    { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
  ],
});

// Helper : Détermine la route par défaut selon le profil
const getDefaultRoute = (authStore: ReturnType<typeof useAuthStore>) => {
  if (authStore.isRecruiter) {
    return authStore.hasCompany
      ? "recruiter-dashboard"
      : "recruiter-onboarding";
  }
  if (authStore.isCandidate) {
    return "candidate-dashboard";
  }
  return "home";
};

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const companyStore = useCompanyStore();

  // 1. Synchronisation initiale si Token présent mais User non chargé
  if (authStore.isAuthenticated && !authStore.currentUser) {
    try {
      await authStore.fetchCurrentUser();

      // Si c'est un recruteur, on charge obligatoirement l'état de la société avant de vérifier les règles de navigation
      if (authStore.isRecruiter) {
        await companyStore.fetchMyCompany();
      }
    } catch (err) {
      console.error(
        "Erreur de récupération de l'utilisateur ou entreprise",
        err,
      );
      return next({ name: "auth", hash: "#connexion" });
    }
  }

  const { isAuthenticated, isRecruiter, hasCompany } = authStore;

  // 2. Utilisateur déjà connecté tentant d'accéder à la page de login
  if (to.name === "auth" && isAuthenticated) {
    return next({ name: getDefaultRoute(authStore) });
  }

  // 3. Restriction d'accès non authentifié
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "auth", hash: "#connexion" });
  }

  // 4. Vérification du rôle requis pour la route
  const requiredRole = to.meta.role as string | undefined;
  if (requiredRole && !authStore.hasRole(requiredRole)) {
    return next({ name: getDefaultRoute(authStore) });
  }

  // 5. Flux spécifique Recruteur (Onboarding vs Dashboard)
  if (isAuthenticated && isRecruiter) {
    if (!hasCompany && to.name !== "recruiter-onboarding") {
      return next({ name: "recruiter-onboarding" });
    }
    if (hasCompany && to.name === "recruiter-onboarding") {
      return next({ name: "recruiter-dashboard" });
    }
  }

  // 6. Mise à jour du titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - TalentFlow`;
  }

  next();
});

export default router;
