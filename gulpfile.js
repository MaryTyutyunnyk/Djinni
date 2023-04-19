const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const cssMinify = require('gulp-clean-css');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function cleanFiles() {
  return src('./dist')
    .pipe(clean(
      {allowEmpty: true, read: false}
    ))
}

function html() {
  return src('./src/index.html')
    .pipe(dest('./dist'))
}

function styles() {
  return src('./src/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        errorLogToConsole: true,
        outputStyle: 'compressed'
      }))
      .pipe(autoPrefixer('last 2 versions'))
      .pipe(cssMinify())
      .pipe(sourcemaps.write('./'))
      .pipe(dest('./dist/css/'))
}

function images() {
  return src('src/img/*')
  .pipe(dest('dist/img'))
}

function watchTask() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000
  });
  watch(
      [
        './src/index.html',
        './src/scss/**/*.scss',
        './src/img/**/*'
      ],
      series(html, styles, images)
  )
}

exports.dev = series(html, styles, images, watchTask);
exports.build = series(cleanFiles, html, styles, images, watchTask);