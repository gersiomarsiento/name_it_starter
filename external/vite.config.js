import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import tailwindcssNesting from 'tailwindcss/nesting';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssImport,
        tailwindcssNesting,
        tailwindcss,
        autoprefixer,
        cssnano,
        postcssPresetEnv({
          stage: 1,
        }),
      ],
    },
  },
  build: {
    minify: true,
    sourcemap: true,
    outDir: '../../assets',
    rollupOptions: {
      input: ['src/main.js', 'src/main.scss'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].chunk.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  root: 'src',
});
