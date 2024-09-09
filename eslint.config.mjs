import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import airbnb from 'eslint-config-airbnb';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], ignores: ['./tailwind.config.js', 'dist'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      airbnb,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        pragma: 'h',
        version: '10.23.1',
      },
    },
  },
];