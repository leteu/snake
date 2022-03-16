// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // to edit target browsers: use "browserslist" field in package.json
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-for'),
    require('autoprefixer'),
  ]
}
