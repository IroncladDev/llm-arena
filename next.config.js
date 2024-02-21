/** @type {import('next').NextConfig} */
const path = require("path")

module.exports = {
  webpack: config => {
    // Set up the alias for handlebars
    config.resolve.alias["handlebars"] = path.resolve(
      __dirname,
      "node_modules/handlebars/dist/handlebars.js"
    )

    // Make sure to return the modified config
    return config
  }
}
