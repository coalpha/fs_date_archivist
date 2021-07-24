const path = require("path");

module.exports = env => {
   const config = {
      entry: "./src/gui.js",
      target: "node",
      output: {filename: "index.js"},
      module: {
         rules: [
            {test: /\.node$/, loader: "node-loader"},
            {test: /\.ico$/ , type: "asset/resource"},
            {test: /\.css$/ , type: "asset/source"},
         ]
      },
      resolve: {extensions: [".js"]},
   };

   if (env.production) {
      config.mode = "production";
      config.output.path = `${__dirname}/build/1_webpack`;
   } else {
      config.mode = "development";
      config.output.path = `${__dirname}/build/0_debug`;
   }

   return config;
};
