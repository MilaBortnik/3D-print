const gulp = require('gulp');
const terser = require('gulp-terser');

const html = function(){
    return gulp.src('./source/index.*html')
    .pipe(gulp.dest('./build/'));
}

const js = function(){
    return gulp.src('./sourse/js/scrip.js')
    .pipe(terser())
    .pipe(gulp.dest('./build'))
}

exports.js = js
exports.html = html