<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list density="compact" class="elevation-2">
          <v-list-item v-for="n in 3" :key="n">
            <template #prepend>
              <v-avatar color="primary" />
            </template>
            <v-list-item-title> Title </v-list-item-title>
            <v-list-item-subtitle> Subtitle </v-list-item-subtitle>
            <template #append>
              <v-text-field
                class="mr-5"
                hide-details
                variant="solo"
                density="compact"
              >
                <template #label> Hi </template>
              </v-text-field>
              <v-btn size="small"> Neka akcija </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12">
        <v-data-table
          class="elevation-2"
          :headers="headers"
          :footer-props="{ itemsPerPageOptions }"
          :items="state.items"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

interface State {
  items: any[];
}

const headers: any[] = [
  {
    text: "Dessert (100g serving)",
    align: "start",
    sortable: false,
    value: "name",
  },
  { text: "Calories", value: "calories" },
  { text: "Fat (g)", value: "fat" },
  { text: "Carbs (g)", value: "carbs" },
  { text: "Protein (g)", value: "protein" },
  { text: "Iron (%)", value: "iron" },
];

const itemsPerPageOptions = [5, 10, 15];

const state: State = reactive({
  items: [
    {
      name: "Frozen Yogurt",
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      iron: 1,
    },
    {
      name: "Ice cream sandwich",
      calories: 237,
      fat: 9.0,
      carbs: 37,
      protein: 4.3,
      iron: 1,
    },
    {
      name: "Eclair",
      calories: 262,
      fat: 16.0,
      carbs: 23,
      protein: 6.0,
      iron: 7,
    },
    {
      name: "Cupcake",
      calories: 305,
      fat: 3.7,
      carbs: 67,
      protein: 4.3,
      iron: 8,
    },
    {
      name: "Gingerbread",
      calories: 356,
      fat: 16.0,
      carbs: 49,
      protein: 3.9,
      iron: 16,
    },
    {
      name: "Jelly bean",
      calories: 375,
      fat: 0.0,
      carbs: 94,
      protein: 0.0,
      iron: 0,
    },
    {
      name: "Lollipop",
      calories: 392,
      fat: 0.2,
      carbs: 98,
      protein: 0,
      iron: 2,
    },
    {
      name: "Honeycomb",
      calories: 408,
      fat: 3.2,
      carbs: 87,
      protein: 6.5,
      iron: 45,
    },
    {
      name: "Donut",
      calories: 452,
      fat: 25.0,
      carbs: 51,
      protein: 4.9,
      iron: 22,
    },
    {
      name: "KitKat",
      calories: 518,
      fat: 26.0,
      carbs: 65,
      protein: 7,
      iron: 6,
    },
  ],
});
</script>
