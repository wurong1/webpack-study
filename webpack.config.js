var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //将css文件从js文件中提取出来

// Create multiple instances
const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('stylesheets/[name]-two.css');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/app.js', // 必须设置
    },
    module: {
      rules: [ //也可以用loaders:
        {
            test: /\.js$/,
            loader: "babel-loader", //可以添加问号设置参数
            exclude: path.resolve(__dirname,'./node_modules/'), //不用loader处理文件的范围
            include: path.resolve(__dirname, './src/'), // path.resolve(__dirname, )设置绝对路径
            query: { // query设置loader参数
                presets: ['latest'], // latset可以转换es2015,es2016，es2017的所有特性
            },
        },
        {
            test: /\.css$/,
            use: extractCSS.extract(['css-loader', 'postcss-loader'])
                // use: [
                //     'style-loader',
                //     'css-loader?importLoaders=1',// 使用import，postcss才会处理在css中@import引入的css,1表示使用css-loader后面的1个loader(postcss)
                //     'postcss-loader'
                //     //loader: "style-loader!css-loader!postcss-loader", // 用!串联两个loader,postcss-loader autoprefixer可以样式添加浏览器前缀如webkit-,mozil-
                // ]
        },
        {
            test: /\.less$/, //配置sass文件同理
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'less-loader',
            ]
        },
        {
            test: /\.html$/,
            loader: 'html-loader', //将html处理为字符串
        },
        {
            test: /\.ejs$/,  //文件后缀名可以是自定义的如.tpl
            loader: 'ejs-loader',
        },
        {
            test: /\.(jpg|png|gif|svg)$/i, 
            loader: 'url-loader', //file-loader
             query: {
                limit: 90000, //小于90k的图片就会打包成base64编码，不会打包成单的img
                name: 'asset/[name]-[hash:5].[ext]'  //设置5位hash
            },
        },
        {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }
      ]
    },
    plugins: [
        new htmlWebpackPlugin({ 
            template: 'index.html',
            inject: 'body', 
        }),
        extractCSS,
    ],
}