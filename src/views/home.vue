<template>
  <div class="d-flex flex-column justify-center items-center h-100 text-center">
    <span> Welcome to the home page </span>
    <speed-dial bottom right fixed>
      <template #activator>
        <v-btn color="error"> Activator </v-btn>
      </template>
      <v-btn variant="flat" color="success"> A </v-btn>
      <v-btn variant="flat" color="success"> B </v-btn>
      <v-btn variant="flat" color="success"> C </v-btn>
    </speed-dial>
  </div>
</template>

<script lang="ts" setup>
import speedDial from "@/components/vuetify/speedDial.vue";
</script>
