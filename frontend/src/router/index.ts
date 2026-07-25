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
      meta: { title: "TalentFlow - Emploi et Recrutement" },
    },
    {
      path: "/connexion-inscription.html",
      name: "auth",
      component: () => import("@/views/auth/AuthView.vue"),
      meta: { title: "Connexion / Inscription - TalentFlow" },
    },
    {
      path: "/login",
      redirect: { name: "auth", hash: "#connexion" },
    },
    {
      path: "/register",
      redirect: { name: "auth", hash: "#inscription" },
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
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "home" },
    },
  ],
});

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.name === "auth" && authStore.isAuthenticated) {
    if (authStore.hasRole("ROLE_RECRUITER")) {
      return next({ name: "recruiter-dashboard" });
    }
    return next({ name: "candidate-dashboard" });
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "auth", hash: "#connexion" });
  }

  const requiredRole = to.meta.role as string | undefined;

  if (requiredRole && !authStore.hasRole(requiredRole)) {
    console.warn(
      `[Guard] Accès refusé à ${to.fullPath}. Rôle requis : ${requiredRole}`,
    );

    // Redirige vers son dashboard s'il est connecté avec un autre rôle, sinon home
    if (authStore.hasRole("ROLE_RECRUITER")) {
      return next({ name: "recruiter-dashboard" });
    } else if (authStore.hasRole("ROLE_CANDIDATE")) {
      return next({ name: "candidate-dashboard" });
    }
    return next({ name: "home" });
  }

  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  next();
});

export default router;
