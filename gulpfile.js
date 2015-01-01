var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

gulp.task('sass', function () {
    gulp.src('./app/scss/*.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['templates', "sass"]);

gulp.task('templates', function() {
    var LOCALS = {
        title: "Timesheet page",
        user: "%username%"
    };

    gulp.src('./app/views/index.jade')
        .pipe(jade(LOCALS))
        .pipe(gulp.dest('./public/'))
});