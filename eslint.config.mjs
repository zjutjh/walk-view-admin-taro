import zjutjh from "@zjutjh/eslint-config";

export default zjutjh({
  vue: true,
  ts: {
    parserOptions: {
      project: ["./tsconfig.json", "**/packages/*/tsconfig.json"]
    }
  },
  overrides: {
    vue: {
      "vue/component-name-in-template-casing": [
        "error",
        "kebab-case",
        {
          registeredComponentsOnly: false
        }
      ]
    }
  },
  ignores: ["**/.output", "**/.nuxt", "**/dist"]
});
