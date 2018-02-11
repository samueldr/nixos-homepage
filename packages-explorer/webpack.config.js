/* global require, module, __dirname */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},
	resolve: {
		alias: {
			"react": "preact-compat",
			"react-dom": "preact-compat",
			// Not necessary unless you consume a module using `createClass`
			"create-react-class": "preact-compat/lib/create-react-class"
		}
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				// ES2015 to JS, without some features:
				// → https://buble.surge.sh/guide/
				loaders: "buble-loader",
				include: path.join(__dirname, "src"),
				query: {objectAssign: "Object.assign"}
			},
			{
				test: /\.part\.html/,
				use: [{loader: "raw-loader"}]
			},
			{
				test: /\.less$/,
				use: [
					{loader: "style-loader"},
					{loader: "css-loader"},
					{loader: "less-loader"},
				]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: "src/app.html",
		})
	]
};
