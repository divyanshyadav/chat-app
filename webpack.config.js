const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { localWifiIp } = require("./build-utils/ip");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	devtool: "inline-source-map",
	devServer: {
		static: "./dist",
		host: localWifiIp,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Chat App",
			template: "./src/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env": JSON.stringify({
				API_URL: `http://${localWifiIp}:3000`,
			}),
		}),
	],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
					},
				},
			},
		],
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
};
