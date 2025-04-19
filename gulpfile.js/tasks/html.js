module.exports = function(config) {
	var gulp = require('gulp'),
		bytediff = require('gulp-bytediff'),
    	livereload = require('gulp-livereload'),
		htmlmin = require('gulp-htmlmin');

	gulp.task('html', function() {
		var stream = gulp.src(config.html.src)
	    	.pipe(bytediff.start())
	        .pipe(htmlmin({
	        	ignoreCustomFragments: [ /\{\{[\s\S]*?\}\}/ ],
	            removeComments: true,
	            collapseInlineTagWhitespace: false,
	            collapseWhitespace: true
	        }))
			.pipe(bytediff.stop())
	        .pipe(gulp.dest(config.build))

	    stream.on('end', function() {
    		process.browserSync.reload();
	    })

	    return stream;
	})
}