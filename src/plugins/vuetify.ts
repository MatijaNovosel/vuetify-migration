import "@mdi/font/css/materialdesignicons.css";
import { VDataTable } from "vuetify/labs/VDataTable";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify({
  components: {
    VDataTable,
  },
  defaults: {
    VDataTable: {
      fixedHeader: true,
      noDataText: "Results not found",
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
});
