import { defineConfig } from "tsup";

const tsupConfig = defineConfig({
  entry: ["trpc-api-export/builder/index.ts"],
  outDir: "trpc-api-export/dist",
  format: ["esm"],
  clean: true,
  dts: {
    // Habilitar resolución completa de tipos
    resolve: true,
    // Exportar solo los tipos
    only: true,
  },
  tsconfig: "trpc-api-export/builder/tsconfig.build.json",
  treeshake: true,
  splitting: false,
  sourcemap: true,
});

// eslint-disable-next-line
export default tsupConfig;
