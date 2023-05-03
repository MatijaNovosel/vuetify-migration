import "@/assets/index.css";
import { registerPlugins } from "@/plugins";
import { createApp } from "vue";
import App from "./app.vue";

const app = createApp(App);

registerPlugins(app);
app.mount("#app");
