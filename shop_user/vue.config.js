const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: process.env.BASE_URL,
  transpileDependencies: true,
  devServer: {
    port: 8090, // 指定新的端口号
  }
});
