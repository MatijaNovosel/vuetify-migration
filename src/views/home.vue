<template>
  <div class="d-flex flex-column justify-center items-center h-100">
    <div class="d-flex flex-column justify-center mx-auto mt-5">
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
      <v-time-picker automatic use-seconds v-model="state.time" class="mx-5" />
      <v-tree-view
        color="primary"
        :items="state.treeViewItems"
        selection-mode="leaf"
        hoverable
        v-model="state.treeViewSelection"
        dense
        open-all
      />
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
import vTreeView from "@/components/vuetify/treeView/vTreeView.vue";
import vSpeedDial from "@/components/vuetify/vSpeedDial.vue";
import { reactive } from "vue";

const state = reactive({
  date: new Date().toISOString().substring(0, 10),
  time: null,
  treeViewSelection: [],
  treeViewItems: [
    {
      id: 1,
      name: "Applications",
      children: [
        { id: 2, name: "Calendar app" },
        { id: 3, name: "Chrome app" },
        { id: 4, name: "Webstorm app" },
      ],
    },
    {
      id: 5,
      name: "Documents",
      children: [
        {
          id: 6,
          name: "vuetify",
          children: [
            {
              id: 7,
              name: "src",
              children: [
                { id: 8, name: "index ts" },
                { id: 9, name: "bootstrap ts" },
              ],
            },
          ],
        },
        {
          id: 10,
          name: "material2",
          children: [
            {
              id: 11,
              name: "src",
              children: [
                { id: 12, name: "v-btn ts" },
                { id: 13, name: "v-card ts" },
                { id: 14, name: "v-window ts" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      name: "Downloads",
      children: [
        { id: 16, name: "October pdf" },
        { id: 17, name: "November pdf" },
        { id: 18, name: "Tutorial html" },
      ],
    },
    {
      id: 19,
      name: "Videos",
      children: [
        {
          id: 20,
          name: "Tutorials",
          children: [
            { id: 21, name: "Basic layouts mp4" },
            { id: 22, name: "Advanced techniques mp4" },
            { id: 23, name: "All about app dir" },
          ],
        },
        { id: 24, name: "Intro mov" },
        { id: 25, name: "Conference introduction avi" },
      ],
    },
  ],
  completion: {
    speedDial: true,
    datePicker: true,
    timePicker: true,
    calendar: false,
    treeView: false,
  },
});
</script>
