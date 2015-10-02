'use strict';

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    notify      = require('gulp-notify'),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(notify({message: 'HTML task complete'}));
});

gulp.task('styles', function () {
    var sassOptions = {
        defaultEncoding: 'UTF-8',
        lineNumbers: true,
        style: 'expanded',
        precision: 8
    };
    gulp.src('src/assets/scss/**/*.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(notify({message: 'styles task complete'}));
});

gulp.task('SLDSwebfonts', function () {
    gulp.src('node_modules/@salesforce-ux/design-system/assets/fonts/webfonts/*')
    .pipe(gulp.dest('dist/assets/fonts/webfonts'))
    .pipe(notify({message: 'SLDSwebfonts task complete'}));
});

gulp.task('SLDSstyles', function () {
    gulp.src('node_modules/@salesforce-ux/design-system/assets/styles/*')
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(notify({message: 'SLDSstyles task complete'}));
});

gulp.task('SLDSicons', function () {
    return gulp.src('node_modules/@salesforce-ux/design-system/node_modules/@salesforce-ux/icons/dist/salesforce-lightning-design-system-icons/**/*')
        .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/assets/js/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('images', function () {
    return gulp.src('src/assets/images/**/*')
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(notify({message: 'images task complete'}));
});

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('build', ['html', 'styles', 'SLDSstyles', 'SLDSwebfonts', 'SLDSicons', 'images', 'scripts']);

gulp.task('default', ['build']);

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function () {

    browserSync({
        server: "./dist"
    });

    gulp.watch("src/**/*.html", ['html']);
    gulp.watch("src/assets/js/**/*.js", ['scripts']);
    gulp.watch("src/assets/scss/**/*.scss", ['styles']);

    gulp.watch("dist/**/*.html").on('change', reload);
    gulp.watch("dist/assets/js/*").on('change', reload);
    gulp.watch("dist/assets/styles/*").on('change', reload);
});