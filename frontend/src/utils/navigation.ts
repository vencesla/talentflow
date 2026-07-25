// src/utils/navigation.ts
import type { Router } from "vue-router";

export async function redirectUserByRole(roles: string[], router: Router) {
  if (roles.includes("ROLE_RECRUITER")) {
    return await router.push({ name: "recruiter-dashboard" });
  } else if (roles.includes("ROLE_CANDIDATE")) {
    return await router.push({ name: "candidate-dashboard" });
  } else {
    return await router.push({ name: "home" });
  }
}
