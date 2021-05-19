const path = require("path");

const dist = path.resolve(__dirname, "dist");

module.exports = {
   mode: "production",
   entry: "./src/gui.js",
   target: "node",
   output: {path: dist, filename: "index.js"},
   module: {
      rules: [
         {test: /\.node$/i, loader: "node-loader"},
         {test: /\.ico$/i,  loader: "file-loader"},
      ]
   },
   resolve: {extensions: [".js"]}
};
