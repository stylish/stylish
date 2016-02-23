var ExtractText = require('extract-text-webpack-plugin')

module.exports = function () {
  return ''
};

module.exports.pitch = function (remainingRequest, preceding, data) {
  this.cacheable(true);

  if (remainingRequest.match(/.yml/)) {
    this.query = `${this.query}&configPath=${remainingRequest}`
  }

  if (remainingRequest.match(/package.json/)) {
    this.query = `${this.query}&configPath=${remainingRequest}`
  }

  var styleLoaders = [
    'style-loader',
    'css-loader',
    'less-loader',
    require.resolve('./bootstrap-styles.loader.js') + this.query
  ];

  var devLoader = styleLoaders.join('!'),
      prodLoader = ExtractText.extract(
        'style-loader',
        styleLoaders.slice(1, styleLoaders.length).join('!')
      );

  var scriptLoader = wrap([
      require.resolve("./bootstrap-scripts.loader.js") + this.query,
      remainingRequest
    ].join("!")
  );

  var styleLoader = process.env.NODE_ENV === 'production'
    ? prodLoader
    : devLoader;

  //styleLoader = devLoader

  var finalLoader = [
    wrap(styleLoader + '!' + remainingRequest),
    scriptLoader
  ].join("\n")

  return finalLoader;
};

function wrap (str, result) {
  result = 'require(';
  result = result + JSON.stringify("-!" + str);
  result = result + ");";

  return result
}
