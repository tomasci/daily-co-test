// const path = require("path")

module.exports = () => ({
	target: "web",
	devtool: "source-map",
	devServer: {
		port: 3000,
		compress: false,
		// open: true,
		historyApiFallback: true,
		hot: true,
		// server: "spdy",
		setupExitSignals: true,
	},
	optimization: {
		minimize: false,
	},
})
