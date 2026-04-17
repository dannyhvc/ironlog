import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/ironlog/", // HACK: remove on local
    plugins: [react()],
});
