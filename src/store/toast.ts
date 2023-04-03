import COLORS from "@/constants/colors";
import { randInt } from "matija-utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface CreateToast {
  msg: string;
  color?: string;
  txtColor?: string;
  permanent?: boolean;
  timeout?: number;
  dismissable?: boolean;
}

export interface Toast {
  id: number;
  msg: string;
  color: string;
  txtColor?: string;
  permanent?: boolean;
  dismissable?: boolean;
}

const TOAST_LIMIT = 5;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  const createToast = ({
    msg,
    color,
    permanent,
    txtColor,
    timeout,
    dismissable,
  }: CreateToast) => {
    if (toasts.value.length + 1 > TOAST_LIMIT) return;

    color = color || "#308050";
    const id = randInt(1, 9999);

    if (!color.startsWith("#")) color = COLORS[color];

    toasts.value.push({
      id,
      msg,
      color,
      txtColor,
      permanent,
      dismissable,
    });

    if (!permanent) {
      setTimeout(() => {
        const toastIdx = toasts.value.findIndex((t) => t.id === id);
        if (toastIdx !== -1) toasts.value.splice(toastIdx, 1);
      }, timeout);
    }
  };

  const removePermanentToasts = () => {
    const toastIdx = toasts.value.findIndex((t) => t.permanent === true);
    if (toastIdx !== -1) toasts.value.splice(toastIdx, 1);
  };

  return {
    toasts,
    createToast,
    removePermanentToasts,
  };
});
