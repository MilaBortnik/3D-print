const { src, dest } = require('gulp')
const terser = require('gulp-terser')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const plumber = require('gulp-plumber')


 html = function(){
    return src('./source/*.html')
    .pipe(dest('./build/'));
}

    js = function(){
    return src('./sourse/js/scrip.js')
    .pipe(terser())
    .pipe(dest('./build'))
}
    css = function(){
    return src('./source/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write("./"))
    .pipe(dest('./build/css'))
}

exports.js = js
exports.html = html
exports.css = css