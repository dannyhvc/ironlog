import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    base: "/ironlog/", // Replace with your exact GitHub repository name
    plugins: [react()],
});
