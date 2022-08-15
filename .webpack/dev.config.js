module.exports = () => {
	return {
		target: "web",
		optimization: {
			minimize: false,
		},
		devtool: "source-map",
		output: {
			filename: "[name].[contenthash].js",
		},
		module: {
			rules: [],
		},
	}
}
