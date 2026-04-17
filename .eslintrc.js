module.exports = {
  extends: ["next/core-web-vitals"],
  ignorePatterns: [
    "src/**/*",
    "App.tsx",
    "app.config.js",
    "babel.config.js",
    "server.js",
    "vite.config.js"
  ],
  rules: {
    "@next/next/no-img-element": "off"
  }
};
