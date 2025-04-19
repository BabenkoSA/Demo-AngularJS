module.exports = function(config) {
	var gulp = require('gulp')

	gulp.task('assets', function() {
		return gulp.src(config.assets.src)
	        .pipe(gulp.dest(config.build + '/assets'))
	});
}
