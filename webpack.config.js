const path = require("path");

module.exports = {
   mode: "production",
   entry: "./src/gui.js",
   target: "node",
   output: {path: `${__dirname}/build/1_webpack`, filename: "index.js"},
   module: {
      rules: [
         {test: /\.node$/, loader: "node-loader"},
         {test: /\.ico$/ , type: "asset/resource"},
         {test: /\.css$/ , type: "asset/source"},
      ]
   },
   resolve: {extensions: [".js"]}
};
