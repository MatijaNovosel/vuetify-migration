<template>
  <v-app-bar>
    <v-list-item>
      <template #prepend>
        <v-avatar class="me-10 ms-4" color="grey-darken-1" size="32" />
      </template>
      <v-list-item-title> Matija N. </v-list-item-title>
      <v-list-item-subtitle> Admin </v-list-item-subtitle>
    </v-list-item>
    <v-spacer />
    <v-btn
      exact
      icon="mdi-account"
      color="red"
      :to="{ name: ROUTE_NAMES.ADMIN }"
    />
    <v-btn
      exact
      icon="mdi-home"
      color="green"
      :to="{ name: ROUTE_NAMES.HOME }"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ROUTE_NAMES } from "@/router/routeNames";
</script>
