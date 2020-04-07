
/**
 * 该文件导入当前目录所有模块
 * 这是一次性方法，不应有任何理由来编辑此文件。
 */

const files = require.context('./components', true, /^\.\/([^/]+?)\/index\.js$/)
const modules = {}

files.keys().forEach(key => {
  console.log(key)
  // modules[key.replace(/^\.\/([^/]+?)\/index\.js$/, '$1')] = files(key).default
})

// // export { ...modules }
// // export default modules
// module.exports = {
//   default: modules,
//   ...modules
// }
