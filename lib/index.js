class LogWebpackPlugin {
  constructor(options) {
    console.log(options);
  }

  apply(compiler) {
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

    // 当依赖的文件发生变化时会触发 watch-run 事件
    compiler.hooks.watchRun.tapAsync(
      "logWebpackPlugin",
      (watching, callback) => {
        // 获取发生变化的文件列表
        const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
        // changedFiles 格式为键值对，键为发生变化的文件路径。
        if (changedFiles[filePath] !== undefined) {
          // filePath 对应的文件发生了变化
          console.log("change");
        }
        callback();
      }
    );

    compiler.hooks.afterCompile.tapAsync(
      "logWebpackPlugin",
      (compilation, callback) => {
        // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
        // compilation.fileDependencies.push(filePath);
        console.log("complie finish");
        callback();
      }
    );

    //有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 emit 事件，因为发生 emit 事件时所有模块的转换和代码块对应的文件已经生成好， 需要输出的资源即将输出，因此 emit 事件是修改 Webpack 输出资源的最后时机。
    compiler.plugin("emit", (compilation, callback) => {
      // 设置名称为 fileName 的输出资源
      compilation.assets[fileName] = {
        // 返回文件内容
        source: () => {
          // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
          return fileContent;
        },
        // 返回文件大小
        size: () => {
          return Buffer.byteLength(fileContent, "utf8");
        }
      };
      callback();
    });

    compiler.plugin("emit", (compilation, callback) => {
      // 读取名称为 fileName 的输出资源
      const asset = compilation.assets[fileName];
      // 获取输出资源的内容
      asset.source();
      // 获取输出资源的文件大小
      asset.size();
      callback();
    });
  }
}

module.exports = LogWebpackPlugin;
