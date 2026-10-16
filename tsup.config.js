import { defineConfig } from 'tsup';
import pkg from './package.json';

const footerJs = `
if (typeof module !== 'undefined' && module.exports && module.exports.default) {
  var _nx = module.exports.default;
  module.exports = _nx;
  module.exports.default = _nx;
  module.exports.nx = _nx;
}
`;

export default defineConfig([
  {
    entry: ['src/index.js'],
    format: ['cjs', 'esm'],
    dts: false,
    clean: true,
    sourcemap: true,
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.js' : '.esm.js'
      };
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    },
    footer: {
      js: footerJs
    }
  },
  {
    entry: { 'index.min': 'src/index.js' },
    format: ['cjs'],
    dts: false,
    clean: false,
    minify: true,
    sourcemap: true,
    outExtension() {
      return {
        js: '.js'
      };
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    },
    footer: {
      js: footerJs
    }
  }
]);
