<template>
  <navbar />
  <v-main class="h-100">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import navbar from "@/components/app/navbar.vue";
</script>
