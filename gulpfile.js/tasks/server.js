module.exports = function(config) {
	var nodemon = require('gulp-nodemon'),
        gulp = require('gulp'),
        runSequence = require('run-sequence');
	
	gulp.task('server', function(callback) {
		runSequence('nodemon', 'browserSync', callback);
	});

	gulp.task('browserSync', function() {
	    return process.browserSync.init({
	        proxy: "localhost:" + config.server.port
	    });
	});

	gulp.task('nodemon', function(callback) {
	    var started = false;

	    return nodemon({
	        script: 'server.js',
	        ext: 'js',
	        ignore: [config.src, config.build, './gulp', './gulpfile.js'],
	        env: {
	            'NODE_ENV': 'development',
	            'NODE_PORT': config.server.port,
	        }
	    }).on('start', function() {
		    if ( ! started) {
		    	callback();
		    	started = true;
		    }
	    })
	});
}