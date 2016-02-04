var ExtractText = require('extract-text-webpack-plugin')

module.exports = function () {};

module.exports.pitch = function (remainingRequest) {
  this.cacheable(true);

  var styleLoaders = [
    require.resolve("style-loader"),
    require.resolve("css-loader"),
    require.resolve("less-loader"),
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

  var styleLoader = this.query && this.query.match(/production/)
    ? prodLoader
    : devLoader;

  styleLoader = devLoader

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

/*
require("-!/Users/jonathan/Skypager/node_modules/style-loader/index.js!/Users/jonathan/Skypager/node_modules/css-loader/index.js!/Users/jonathan/S
kypager/node_modules/less-loader/index.js!/Users/jonathan/Skypager/packages/skypager-themes/bootstrap-styles.loader.js?theme=dashboard!/Users/jona
than/Skypager/node_modules/json-loader/index.js!/Users/jonathan/Skypager/package.json")
*/
