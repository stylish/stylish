import defaults from 'lodash/object/defaults'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export function HtmlPlugin (options = {}) {
  defaults(options, {
    title: 'Skypager',
    id: 'webpack-html',
    hash: false,
    inject: 'body',
    bodyScripts: [],
    staticStyles: [],
    headerScripts: [],
    googleFont: 'Roboto:300,400,500,700,400italic',
    filename: 'index.html',
    template: `${ __dirname }/templates/basic.html`,
  })

  return (config) =>
    config.plugin(options.id, HtmlWebpackPlugin, [options])
}

export default HtmlPlugin
