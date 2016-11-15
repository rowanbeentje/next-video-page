const nWebpack = require('@financial-times/n-webpack');

module.exports = nWebpack({
	entry: {
		'./public/main.js': './client/main.js',
		'./public/main.css': './client/main.scss'
	},
	withHashedAssets: true,
	withHeadCss: true,
}, true);
