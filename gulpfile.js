var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
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
        title: "Timesheet",
        user: "%username%"
    };

    gulp.src('./app/views/dev.jade')
        .pipe(jade(LOCALS))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./public/'))
});