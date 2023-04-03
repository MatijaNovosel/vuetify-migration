<template>
  <div class="d-flex flex-column justify-center items-center h-100">
    <v-card width="500" class="mx-auto">
      <v-card-title> vuetify-migration </v-card-title>
      <v-card-subtitle> Log in now! </v-card-subtitle>
      <v-card-text>
        <v-text-field
          hide-details
          density="comfortable"
          label="Username"
          class="mb-3"
        />
        <v-text-field hide-details density="comfortable" label="Password" />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn @click="logIn" variant="flat" color="success"> Log in </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ROUTE_NAMES } from "@/router/routeNames";
import { useToastStore } from "@/store/toast";
import { useRouter } from "vue-router";

const toastStore = useToastStore();
const router = useRouter();

const logIn = () => {
  toastStore.createToast({
    msg: "Login triggered!",
    color: "#16c60c",
    txtColor: "white",
    timeout: 5000,
  });
  router.push({
    name: ROUTE_NAMES.ADMIN,
  });
};
</script>
