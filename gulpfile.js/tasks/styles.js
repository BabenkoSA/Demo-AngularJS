module.exports = function(config) {
    var gulp = require('gulp'),
        cleanCSS = require('gulp-clean-css'),
        plumber = require('gulp-plumber'),
        runSequence = require('run-sequence'),
        bytediff = require('gulp-bytediff'),
        sourcemaps = require('gulp-sourcemaps'),
        postcss = require('gulp-postcss'),
        atImport = require('postcss-import');

    gulp.task('styles', function() {
        return gulp.src(config.styles.entrypoint)
            .pipe(plumber({
                errorHandler: function(err) {
                    console.error(err.message);
                }
            }))
            .pipe(sourcemaps.init())
            .pipe(postcss([
                atImport() // Handles @import statements
            ]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.build + '/styles'))
            .pipe(process.browserSync.stream());
    });

    gulp.task('minify-styles', function() {
        return gulp.src(config.build + '/styles/index.css')
            .pipe(plumber())
            .pipe(bytediff.start())
            .pipe(cleanCSS({ compatibility: 'ie8', inline: ['none'] }))
            .pipe(bytediff.stop())
            .pipe(plumber.stop())
            .pipe(gulp.dest(config.build + '/styles/'));
    });
};