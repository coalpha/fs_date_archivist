const path = require("path");

module.exports = {
   mode: "production",
   entry: "./src/gui.js",
   target: "node",
   output: {path: `${__dirname}/build/1_webpack`, filename: "index.js"},
   module: {
      rules: [
         {test: /\.node$/i, loader: "node-loader"},
         {test: /\.ico$/i,  loader: "file-loader"},
      ]
   },
   resolve: {extensions: [".js"]}
};
