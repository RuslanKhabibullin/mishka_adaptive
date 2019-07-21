'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var plumber = require('gulp-plumber')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var ccso = require('gulp-csso')
var rename = require('gulp-rename')
var server = require('browser-sync').create()
var run = require('run-sequence')
var del = require('del')
var posthtml = require('gulp-posthtml')
var include = require('posthtml-include')
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var rollup = require('gulp-better-rollup')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var stylelint = require('gulp-stylelint')
var eslint = require('gulp-eslint')

gulp.task('clean', function () {
  return del('build')
})

gulp.task('eslint', function () {
  var needToFix = process.argv.indexOf('--fix') > -1

  return gulp
    .src('js/**/*.js')
    .pipe(eslint({ fix: needToFix }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('js'))
})

gulp.task('scss-lint', function () {
  var needToFix = process.argv.indexOf('--fix') > -1

  return gulp
    .src(['sass/**/*.scss', '!sass/normalize.scss'])
    .pipe(
      stylelint({
        failAfterError: true,
        fix: needToFix,
        reporters: [{ formatter: 'string', console: true }]
      })
    )
    .pipe(gulp.dest('sass'))
})

gulp.task('style', function () {
  return gulp
    .src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('css'))
    .pipe(ccso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(gulp.dest('css'))
    .pipe(server.stream())
})

gulp.task('html', function () {
  return gulp
    .src('*.html')
    .pipe(posthtml([include()]))
    .pipe(gulp.dest('build'))
})

gulp.task('images', function () {
  return gulp
    .src('images/**/*.{png,jpg,svg}')
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ prograssive: true }),
        imagemin.svgo()
      ])
    )
    .pipe(gulp.dest('images'))
})

gulp.task('scripts', function () {
  return gulp
    .src('js/main.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rollup({}, 'iife'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
})

gulp.task('copy', ['html', 'scripts', 'style'], function () {
  return gulp
    .src(['fonts/**/*.{woff,woff2}', 'images/**'], {
      base: '.'
    })
    .pipe(gulp.dest('build'))
})

gulp.task('js-watch', ['scripts'], function (done) {
  server.reload()
  done()
})

gulp.task('serve', function () {
  server.init({
    server: './build',
    notify: false,
    open: true,
    cors: true,
    port: 3502,
    ui: false
  })

  gulp.watch('sass/**/*.scss', ['style'])
  gulp.watch('js/**/*.js', ['js-watch'])
  gulp.watch('./**/*.html').on('change', e => {
    if (e.type !== 'deleted') {
      gulp.start('html')
      server.reload()
    }
  })
})

gulp.task('build', function (done) {
  run('clean', 'images', 'copy', done)
})
