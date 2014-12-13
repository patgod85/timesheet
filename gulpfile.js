var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('default', ['templates']);

gulp.task('templates', function() {
    var LOCALS = {
        title: "Timesheet page",
        user: "%username%"
    };

    gulp.src('./app/views/index.jade')
        .pipe(jade(LOCALS))
        .pipe(gulp.dest('./public/'))
});