"use strict";

const
    gulp = require('gulp'),
    scss = require('gulp-sass'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    bs = require('browser-sync').create(),
    imgMin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    gulpIf = require('gulp-if'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    ap = require('gulp-autoprefixer'),
    htmlmin = require('gulp-minify-html'),
    uglify = require('gulp-uglify-es').default;

let isDevelopment = false;


gulp.task('html', () => {
    return gulp.src('front-end/index.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('public'))
});

gulp.task('styles', () => {
    return gulp.src('front-end/scss/style.scss', {since: gulp.lastRun('styles')})
        .pipe(ap({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(scss())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'));
});

gulp.task('jq', () => {
    return gulp.src('front-end/js/jquery-3.3.1.min.js', { since: gulp.lastRun('jq')})
        .pipe(gulp.dest('public/js'));
});

gulp.task('js', () => {
    return gulp.src(['front-end/js/my.js'], {since: gulp.lastRun('js')})
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public/js'));
});

gulp.task('images', () => {
    return gulp.src('front-end/img/**.*')
        .pipe(imgMin())
        .pipe(gulp.dest('public/img'));
});

gulp.task('clean', () => {
    return del('public');
});

gulp.task('serve', () => {
    bs.init({
        server: 'public'
    });
    bs.watch('public/**/*.*').on('change', bs.reload)
});

gulp.task('watch', () => {
    gulp.watch(['front-end/js/my.js'], gulp.series('js'));
    gulp.watch('front-end/scss/**.*', gulp.series('styles'));
    gulp.watch('front-end/img/**.*', gulp.series('images'));
    gulp.watch('front-end/index.html', gulp.series('html'));
});

gulp.task('develop',
    gulp.series(
        'clean',
        gulp.parallel('jq','js','html','styles','images'),
        gulp.parallel('watch', 'serve'))
);

gulp.task('build',gulp.series('clean',gulp.parallel('jq','js','html','styles','images')));



