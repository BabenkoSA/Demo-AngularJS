module.exports = function(config) {
	var gulp = require('gulp'),
    	bro = require('gulp-bro'),
    	terser = require('gulp-terser'),
	    envify = require('envify/custom'),
		plumber = require('gulp-plumber'),
		bytediff = require('gulp-bytediff'),
	    stringify = require('stringify');

    gulp.task('watch-scripts', ['scripts'], function(done) {
		reloadDelay: 1000,
		process.browserSync.reload();
    	done();
    })

	gulp.task('scripts', function() {

		var transforms = [
            ['stringify', {
            	global: true
            }],
            envify(config.scripts.environment),
        ]

	    return gulp.src(config.scripts.entrypoint, { read: false })
	        .pipe(bro({
	            insertGlobals: true,
	            transform: transforms,
	            debug: true
	        }))
	        .pipe(gulp.dest(config.build))
	});

	gulp.task('minify-scripts', function() {
	    return gulp.src(config.build + '/index.js')
	    	.pipe(plumber())
	    	.pipe(bytediff.start())
            .pipe(terser({mangle: false}))
			.pipe(bytediff.stop())
			.pipe(plumber.stop())
			.pipe(gulp.dest(config.build));
	});

}
