const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const dotenv = require("dotenv-webpack")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = () => ({
	mode: "development",
	entry: "./src/index.tsx",
	devtool: "eval",
	stats: "errors-warnings",
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "../build"),
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			},
			{
				test: /\.(tsx|ts)$/,
				loader: "ts-loader",
				exclude: "/node_modules/",
			},
			{
				test: /\.svg$/,
				use: ["@svgr/webpack", "url-loader"],
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: ["url-loader"],
			},
			{
				test: /\.(ttf|mp3|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				// exclude: /node_modules/,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|jp2|webp)$/,
				loader: "file-loader",
				options: {
					name: "images/[name].[ext]",
				},
			},
		],
	},
	plugins: [
		new dotenv(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
			favicon: "./public/favicon.ico",
			logo192: "./public/logo192.png",
			logo512: "./public/logo512.png",
		}),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			"@/src": path.resolve(__dirname, "../src"),
			"@/pages": path.resolve(__dirname, "../src/_pages"),
			"@/components": path.resolve(__dirname, "../src/components"),
			"@/hooks": path.resolve(__dirname, "../src/hooks"),
			"@/router": path.resolve(__dirname, "../src/router"),
			"@/services": path.resolve(__dirname, "../src/services"),
			"@/store": path.resolve(__dirname, "../src/store"),
			"@/types": path.resolve(__dirname, "../src/types"),
			"@/utils": path.resolve(__dirname, "../src/utils"),
			"@/validation": path.resolve(__dirname, "../src/validation"),
		},
	},
})
