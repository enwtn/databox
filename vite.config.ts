import type { UserConfig } from "vite";

export default {
  build: {
    modulePreload: false,
  },
} satisfies UserConfig;
