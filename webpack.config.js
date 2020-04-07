const fs = require('fs')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin');

const mode = process.env.NODE_ENV || 'production'
const debug = mode !== 'production'

const getPath = function (...paths) {
  return path.join(__dirname, ...paths)
}

const srcPath = './src'
const distPath = './lib'

const webpackConfig = {
  mode: mode,
  entry: {},
  output: {
    path: getPath(distPath),
    libraryTarget: 'umd',
    library: '[name]',
    globalObject: 'this',
    publicPath: '/',
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}'],
    })
  ]
}

// -------------------------------------------

function getEntry () {
  const moduleEntry = {}

  const files = fs.readdirSync(getPath(srcPath, './components'))

  for (const name of files) {
    if (name === 'index.js') continue

    const entryPath = getPath(srcPath, './components', name)

    const stat = fs.statSync(entryPath)

    if (!stat) continue

    // const isFile = stat.isFile()
    const isDirectory = stat.isDirectory()

    const basename = path.basename(entryPath, path.extname(entryPath))
    if (isDirectory) {
      moduleEntry[basename] = entryPath
    }
  }

  return moduleEntry
}

webpackConfig.entry = getEntry()

module.exports = webpackConfig
