const {merge} = require("webpack-merge")

const commonConfig = require("./.webpack/common.config")
const devConfig = require("./.webpack/dev.config")
const localConfig = require("./.webpack/local.config")

module.exports = (env) => {
	if (env.local) return merge(commonConfig(), devConfig(), localConfig())

	if (env.dev || env === "development")
		return merge(commonConfig(), devConfig())

	throw new Error("Wrong Environment!")
}
