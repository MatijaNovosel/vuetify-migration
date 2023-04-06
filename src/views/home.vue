<template>
  <div class="d-flex flex-column justify-center items-center h-100 text-center">
    <span> Welcome to the home page </span>
    <div>
      <date-picker max="" min="" type="date" value="" />
    </div>
    <speed-dial bottom right fixed direction="left">
      <template #activator="{ activate }">
        <v-btn @click="activate()" color="error" icon="mdi-vuetify" />
      </template>
      <v-btn color="success" icon="mdi-vuetify" />
      <v-btn class="mx-2" color="info" icon="mdi-vuetify" />
      <v-btn color="error" icon="mdi-vuetify" />
    </speed-dial>
  </div>
</template>

<script lang="ts" setup>
import datePicker from "@/components/vuetify/datePicker/datePicker.vue";
import speedDial from "@/components/vuetify/speedDial.vue";
</script>
