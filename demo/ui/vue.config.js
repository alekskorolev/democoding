const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      }
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set('@libs/shared', path.resolve(__dirname, '../api/libs/shared/src'))
  }
});
