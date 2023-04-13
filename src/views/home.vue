<template>
  <div class="d-flex flex-column justify-center items-center h-100 text-center">
    <span> Welcome to the home page </span>
    <div class="mt-5 d-flex justify-center">
      <v-date-picker
        max="2020-04-12"
        min="2020-01-24"
        locale="en-us"
        color="green lighten-1"
        :value="state.date"
        @input="dateChanged"
      />
      <v-time-picker class="ml-5" :value="state.time" />
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
import vDatePicker from "@/components/vuetify/datePicker/vDatePicker.vue";
import speedDial from "@/components/vuetify/speedDial.vue";
import vTimePicker from "@/components/vuetify/timePicker/vTimePicker.vue";
import { reactive } from "vue";

const state = reactive({
  date: new Date().toISOString().substring(0, 10),
  time: null,
});

const dateChanged = (val: string) => {
  state.date = val;
};
</script>
