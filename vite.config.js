import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  assetsInclude: ["**/*.ktx2", "**/wasm.js"],
  build: {
    target: "ES2022"
  }
});