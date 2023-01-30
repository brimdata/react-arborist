const withTM = require("next-transpile-modules")([
  "auto-scroll-while-dragging",
]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withTM(nextConfig);
