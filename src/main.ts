import "@/assets/index.css";
import { registerPlugins } from "@/plugins";
import degreePicker from "degree-picker";
import { createApp } from "vue";
import App from "./app.vue";

import "degree-picker/dist/degree-picker.css";

const app = createApp(App);

app.use(degreePicker);

registerPlugins(app);
app.mount("#app");
