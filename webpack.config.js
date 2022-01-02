const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const isDev = mode === "development";

module.exports = {
	mode,
	entry: "./src/index.js",
	devtool: "inline-source-map",
	devServer: {
		static: "./dist",
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Chat App",
			template: "./src/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env": JSON.stringify(
				isDev ? require("./env/dev") : require("./env/prod")
			),
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
			{
				test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
				type: "asset/resource",
			},
		],
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},

	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/
						)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace("@", "")}`;
					},
				},
			},
		},
	},
};
