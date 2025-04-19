module.exports = function() {
	require('gulp').task('dev', ['server', 'scripts', 'html', 'styles', 'assets', 'watch']);
}
