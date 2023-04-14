<template>
  <v-app>
    <router-view />
  </v-app>
  <toasts />
</template>

<script setup lang="ts">
import Toasts from "@/components/app/toasts.vue";
import { onMounted } from "vue";
import { useToastStore } from "./store/toast";

const toastStore = useToastStore();

onMounted(() => {
  toastStore.createToast({
    msg: "✅ Application successfully started!",
    color: "#16c60c",
    txtColor: "white",
    timeout: 5000,
  });
});
</script>
