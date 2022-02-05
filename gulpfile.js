const { src, dest, watch, series} = require('gulp')
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
const server = require ('browser-sync')
const del = require ('del')


 


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
   return src('./source/scss/**/*.scss')
   .pipe(plumber())
   .pipe(sourcemaps.init())
   .pipe(sass())
   .pipe(autoprefixer())
   .pipe(csso())
   .pipe(rename('.style.min.css'))
   .pipe(sourcemaps.write('./'))
   .pipe(dest('build/css')) 
}

function cssNomin (){
    return src('./source/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest('build/css')) 
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
function serve (){
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    })
    watch('./source/scss/**/*.scss', series(css, cssNomin, refresh ))
    watch('./source/*.html', series(html, refresh))
}
function refresh(done){
    server.reload()
    done()
}
function delet(done){
    del.sync('./build/*/')
    done()
}


exports.js = js
exports.html = html
exports.css = css
exports ['css-nomin'] = cssNomin
exports.images = images
exports.sprite = sprite
exports.start = series(
    images,
    copy,
    html,
    css,
    cssNomin,
    sprite,
    js
)
exports.serve = serve
exports.delet = delet