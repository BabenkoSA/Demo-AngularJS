module.exports = function(config) {
	var gulp = require('gulp');

	gulp.task('watch', function() {
		gulp.watch(config.styles.src, ['styles']);
		gulp.watch(config.html.src, ['html']);
  	    gulp.watch(config.scripts.src, ['watch-scripts']);
		gulp.watch(config.assets.src, ['assets']);
	});
}
