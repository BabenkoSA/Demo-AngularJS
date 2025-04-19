module.exports = {

	src: 'src',

	build: 'build',

	scripts: {
		src: ['src/**/*.js'],

		entrypoint: 'src/index.js',

        environment: require('../.env.js')
	},

	assets: {
		src: 'src/assets/**/*'
	},

	server: {
		port: require('../.env.js').node_port
	},


	html: {
		src: 'src/**/*.html',
	},

	styles: {
		entrypoint: 'src/styles/index.css',

		src: ['src/styles/**/*.css']
	}

};
