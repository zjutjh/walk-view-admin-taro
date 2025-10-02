/**
 * @type {import('lint-staged').Config}
 */
export default {
  "*.{(m)ts,(m)js,vue,css,json,html}": ["pnpm run lint"]
};
