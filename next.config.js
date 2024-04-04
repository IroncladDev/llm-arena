/** @type {import('next').NextConfig} */
const path = require("path")

module.exports = {
  webpack: config => {
    // Set up the alias for handlebars
    config.resolve.alias["handlebars"] = path.resolve(
      __dirname,
      "node_modules/handlebars/dist/handlebars.js"
    )

    // For Discord.js to work in Server Actions
    config.module.rules.push({
      test: /\.node/,
      use: "node-loader"
    })

    // Make sure to return the modified config
    return config
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  }
}
