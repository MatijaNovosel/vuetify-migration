import router from "../router";
import pinia from "../store";
import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";

import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify).use(pinia).use(router);
}
