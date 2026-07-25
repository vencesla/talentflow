import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Bootstrap CSS et JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "@/assets/css/auth.css";
import "@/assets/css/home.css";

const pinia = createPinia();
createApp(App).use(pinia).use(router).mount("#app");
