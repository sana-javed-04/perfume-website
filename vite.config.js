import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        shop: resolve(__dirname, "shop.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        product: resolve(__dirname, "product.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});
