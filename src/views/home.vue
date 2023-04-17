<template>
  <div class="d-flex flex-column justify-center items-center h-100 text-center">
    <div class="d-flex flex-column justify-center mx-auto">
      <v-checkbox
        hide-details
        color="green"
        label="v-speed-dial"
        density="compact"
        readonly
        v-model="state.completion.speedDial"
      />
      <v-checkbox
        hide-details
        color="green"
        label="v-date-picker"
        density="compact"
        readonly
        v-model="state.completion.datePicker"
      />
      <v-checkbox
        hide-details
        color="green"
        label="v-time-picker"
        density="compact"
        readonly
        v-model="state.completion.timePicker"
      />
      <v-checkbox
        hide-details
        color="green"
        label="v-calendar"
        density="compact"
        readonly
        v-model="state.completion.calendar"
      />
      <v-checkbox
        hide-details
        color="green"
        label="v-treeview"
        density="compact"
        readonly
        v-model="state.completion.treeView"
      />
    </div>
    <div class="mt-5 d-flex justify-center">
      <v-date-picker
        max="2020-04-12"
        min="2020-01-24"
        locale="en-us"
        color="green lighten-1"
        v-model="state.date"
      />
      <v-time-picker automatic use-seconds v-model="state.time" class="ml-5" />
    </div>
    <v-speed-dial bottom right fixed direction="left">
      <template #activator="{ activate }">
        <v-btn @click="activate()" color="error" icon="mdi-vuetify" />
      </template>
      <v-btn color="success" icon="mdi-vuetify" />
      <v-btn class="mx-2" color="info" icon="mdi-vuetify" />
      <v-btn color="error" icon="mdi-vuetify" />
    </v-speed-dial>
  </div>
</template>

<script lang="ts" setup>
import vDatePicker from "@/components/vuetify/datePicker/vDatePicker.vue";
import vTimePicker from "@/components/vuetify/timePicker/vTimePicker.vue";
import vSpeedDial from "@/components/vuetify/vSpeedDial.vue";
import { reactive } from "vue";

const state = reactive({
  date: new Date().toISOString().substring(0, 10),
  time: null,
  completion: {
    speedDial: true,
    datePicker: true,
    timePicker: true,
    calendar: false,
    treeView: false,
  },
});
</script>
