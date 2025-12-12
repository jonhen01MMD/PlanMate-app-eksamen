const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)


config.transformer = {
	...config.transformer,
	babelTransformerPath: require.resolve('react-native-svg-transformer'), // Add SVG transformer
}

config.resolver = {
	...config.resolver,
	assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'), // Exclude SVG from asset extensions
	sourceExts: [...config.resolver.sourceExts, 'svg'], // Include SVG in source extensions
}

module.exports = withNativeWind(config, { input: './global.css' })