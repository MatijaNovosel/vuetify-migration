import { createRouter, createWebHistory } from "vue-router";
import { ROUTE_NAMES } from "./routeNames";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/default.vue"),
    children: [
      {
        path: "",
        name: ROUTE_NAMES.HOME,
        component: () => import("@/views/home.vue"),
      },
      {
        path: "admin",
        name: ROUTE_NAMES.ADMIN,
        component: () => import("@/views/admin.vue"),
      },
      {
        path: "login",
        name: ROUTE_NAMES.LOGIN,
        component: () => import("@/views/login.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
