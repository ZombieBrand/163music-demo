// module.exports = {
//   entry: "./src/home.js",
//   output: {
//     filename: "./dist/home.js"
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader", "postcss-loader"]
//       },
//       // {
//       //   test: /\.js$/,
//       //   exclude: /node_modules/,
//       //   loader: "eslint-loader",
//       //   options: {}
//       // },
//     ]
//   }
// };

// 获取环境命令，并去除首尾空格
const env = process.env.NODE_ENV.replace(/(\s*$)|(^\s*)/ig,"");
// 根据环境变量引用相关的配置文件
module.exports = require(`./config/webpack.config.${env}.js`)
