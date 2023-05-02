<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <degree-picker color="green" v-model="degrees" />
      </v-col>
      <v-col cols="12" class="text-center">
        <h1>{{ degrees }} degrees</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import degreePicker from "@/components/degree-picker/degreePicker.vue";
import { ref } from "vue";

const degrees = ref(0);
</script>
