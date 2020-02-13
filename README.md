# log-webpack-plugin

## 知识点

- [compiler]("https://www.webpackjs.com/api/compiler-hooks/") Compiler 模块是 webpack 的支柱引擎
- [compilation]("https://www.webpackjs.com/api/compilation-hooks/") Compilation 模块会被 Compiler 用来创建新的编译（或新的构建）
- [resolver]("https://www.webpackjs.com/api/resolvers/#%E7%B1%BB%E5%9E%8B") resolver 是由 enhanced-resolve package 创建出来的。Resolver 类继承了 tapable 类，并且使用 tapable 提供的一些钩子。
- [parser]("https://www.webpackjs.com/api/parser/") parser 实例，是用来解析由 webpack 处理过的每个模块。

### 总结

`webpack plugin` 就是一个 js 的类 通过 `constructor` 传递 `options`

`apply` 会在 `webpack` 执行 `new MyPlugin` 时候 传递 `compiler`

基于`hooks` 每个知识点中提到的内容都提到一系列钩子

```js
compiler.hooks.compile.tapAsync("LogWebpackPlugin", function(
  compilation,
  callback
) {
  // compilation.chunks 存放所有代码块，是一个数组
  compilation.chunks.forEach(function(chunk) {
    // chunk 代表一个代码块
    // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
    for (const module of chunk.modulesIterable) {
      // module 代表一个模块
      // module.dependencies 存放当前模块的所有依赖的文件路径，是一个数组
      module.dependencies.forEach(function(filepath) {
        console.log(filepath);
      });
    }

    // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
    // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
    // 该 Chunk 就会生成 .js 和 .css 两个文件
    chunk.files.forEach(function(filename) {
      // compilation.assets 存放当前所有即将输出的资源
      // 调用一个输出资源的 source() 方法能获取到输出资源的内容
      let source = compilation.assets[filename].source();
    });
  });

  // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
  // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
  callback();
});
```
