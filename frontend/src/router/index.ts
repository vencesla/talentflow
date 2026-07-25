import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useAuthStore } from "@/stores/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "HelloWork - Emploi et Recrutement" },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
    },
    {
      path: "/connexion-inscription.html",
      name: "auth",
      component: () => import("@/views/auth/AuthView.vue"),
    },
    {
      path: "/recruiter/dashboard",
      name: "recruiter-dashboard",
      component: () => import("@/views/recruiter/DashboardView.vue"),
      meta: { requiresAuth: true, role: "ROLE_RECRUITER" },
    },
    {
      path: "/candidate/dashboard",
      name: "candidate-dashboard",
      component: () => import("@/views/candidate/DashboardView.vue"),
      meta: { requiresAuth: true, role: "ROLE_CANDIDATE" },
    },
  ],
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 1. Protection des routes nécessitant une connexion
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "auth" });
  }

  // 2. Vérification du rôle avec la méthode `hasRole` du store
  const requiredRole = to.meta.role as string | undefined;

  if (requiredRole && !authStore.hasRole(requiredRole)) {
    console.warn(
      `[Guard] Accès refusé à ${to.fullPath}. Rôle requis : ${requiredRole}`,
    );

    // Redirige vers home si l'utilisateur n'a pas le bon rôle
    if (to.name !== "home") {
      return next({ name: "home" });
    }
  }

  // 3. Tout est OK, on autorise la navigation
  next();
});

export default router;
