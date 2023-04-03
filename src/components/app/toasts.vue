<template>
  <transition-group name="list" class="toast-ctr d-flex flex-column" tag="div">
    <v-alert
      class="mt-5 text-subtitle-2"
      density="compact"
      elevation="4"
      transition="scale-transition"
      v-for="toast of toasts"
      :key="toast.id"
      :color="toast.color"
      :style="{
        color: toast.txtColor,
      }"
    >
      {{ toast.msg }}
    </v-alert>
  </transition-group>
</template>

<script lang="ts" setup>
import { useToastStore } from "@/store/toast";
const { toasts } = useToastStore();
</script>

<style scoped>
.toast-ctr {
  left: 50%;
  transform: translateX(-50%);
  bottom: 25px;
  position: absolute;
}
</style>
