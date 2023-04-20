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
      <span class="mt-8">
        <v-icon color="green" icon="mdi-leaf" class="mr-3" />
        <code>
          {{
            state.treeViewSelection.length
              ? state.treeViewSelection.sort()
              : "None"
          }}
        </code>
      </span>
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
      name: "ID 1",
      children: [
        { id: 2, name: "ID 2" },
        { id: 3, name: "ID 3" },
        { id: 4, name: "ID 4" },
      ],
    },
    {
      id: 5,
      name: "ID 5",
      children: [
        {
          id: 6,
          name: "ID 6",
          children: [
            {
              id: 7,
              name: "ID 7",
              children: [
                { id: 8, name: "ID 8" },
                { id: 9, name: "ID 9" },
              ],
            },
          ],
        },
        {
          id: 10,
          name: "ID 10",
          children: [
            {
              id: 11,
              name: "ID 11",
              children: [
                { id: 12, name: "ID 12" },
                { id: 13, name: "ID 13" },
                { id: 14, name: "ID 14" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      name: "ID 15",
      children: [
        { id: 16, name: "ID 16" },
        { id: 17, name: "ID 17" },
        { id: 18, name: "ID 18" },
      ],
    },
    {
      id: 19,
      name: "ID 19",
      children: [
        {
          id: 20,
          name: "ID 20",
          children: [
            { id: 21, name: "ID 21" },
            { id: 22, name: "ID 22" },
            { id: 23, name: "ID 23" },
          ],
        },
        { id: 24, name: "ID 24" },
        { id: 25, name: "ID 25" },
      ],
    },
  ],
  completion: {
    speedDial: true,
    datePicker: true,
    timePicker: true,
    calendar: false,
    treeView: true,
  },
});
</script>
