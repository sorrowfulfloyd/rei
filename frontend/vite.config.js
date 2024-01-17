import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
	plugins: [react()],
	commonjsOptions: { transformMixedEsModules: true },
	define: {
		"process.env": process.env,
	},
});
