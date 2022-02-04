const { src, dest, series} = require('gulp')
const terser = require('gulp-terser')
const plumber = require('gulp-plumber')
const sourcemaps = require ('gulp-sourcemaps')
const sass = require ('gulp-sass')(require('sass'))
const autoprefixer = require ('gulp-autoprefixer')
const rename =require ('gulp-rename')
const csso = require ('gulp-csso')
const imagemin = require ('gulp-imagemin')
const svgstore = require ('gulp-svgstore')
const pipeline = require('readable-stream').pipeline
const uglify = require('gulp-uglify-es').default
const deleted= require('gulp-deleted')
const gulp = require('gulp')
 


    function html (){
    return src('./source/*.html')
    .pipe(dest('./build/'));
}

function js() {
    return pipeline (
        src('./source/js/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('.'),
        rename({suffix: '.min'}),
        dest('build/js')
    )
}
    function css (){
   return src('./source/sass/**/*.sass')
   .pipe(plumber())
   .pipe(sourcemaps.init())
   .pipe(sass())
   .pipe(autoprefixer())
   .pipe(csso())
   .pipe(rename('.style.min.css'))
   .pipe(sourcemaps.write('./'))
   .pipe(dest('build/sass')) 
}

function cssNomin (){
    return src('./source/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest('build/sass')) 
 }

 function images (){
     return src('./source/img/**/*.{png,jpg,jpeg}')
     .pipe(imagemin ([
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
     ]))
     .pipe(dest('build/img'))
 }
 function sprite(){
     return src('./source/img/icon-*.svg')
     .pipe(imagemin([imagemin.svgo()]))
     .pipe(svgstore({
         inlineSvg:true
     }))
     .pipe(rename('sprite.svg'))
     .pipe(dest('./build/img'))
 }
 function copy() {
    return src ([
        'source/fonts/**/*',
        'source/*.ico*'
    ], {
        base: 'source'
    })
    .pipe(dest('build'))
}
const clean = function() {
    return gulp.src('./source').pipe(deleted({src: './source', dest: './build', patterns:['**/*']})).pipe(gulp.dest('./build'))
}


exports.js = js
exports.html = html
exports.css = css
exports ['css-nomin'] = cssNomin
exports.images = images
exports.sprite = sprite
exports.start = series(
    clean,
    images,
    copy,
    html,
    css,
    cssNomin,
    sprite,
    js
)