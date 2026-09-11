import { defineConfig } from '@rstest/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Note: pluginEslint is deliberately NOT loaded here. Lint is its own CI step;
// running it inside the test build would turn a style warning into a test
// failure and vice versa.
export default defineConfig({
  plugins: [pluginReact()],

  // jsdom is held at 26.x on purpose. jsdom 27 declares
  // `engines.node: ^20.19.0 || ^22.12.0 || >=24.0.0`, and CI pins Node to
  // 20.11.1 to match the Dockerfile. On 20.11.1 its html-encoding-sniffer
  // dependency does a require() of an ES module, which that Node cannot do, and
  // every test file fails to load. npm does not enforce `engines`, so this only
  // shows up in CI -- a newer local Node hides it entirely.
  // A Dependabot PR raising jsdom to 27 will fail CI until Node is bumped too.
  testEnvironment: 'jsdom',
  setupFiles: ['./src/setupTests.ts'],
  include: ['src/**/*.{test,spec}.{ts,tsx}'],

  tools: {
    rspack: (config: any) => {
      // Mirrors the asset rule in rsbuild.config.ts so statically imported
      // assets (Nav.js) resolve the same way here as in the real build.
      // Dynamic `require(`../assets/${x}`)` calls are NOT covered by this --
      // rspack leaves those untransformed; see the require.extensions shim in
      // src/setupTests.ts.
      config.module ??= {};
      config.module.rules ??= [];
      config.module.rules.unshift({
        test: /\.(png|pdn|mkv)$/,
        type: 'asset/resource',
        generator: { filename: 'static/media/[name].[hash][ext]' },
      });
      return config;
    },
  },
});
