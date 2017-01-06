const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const path = require("path");
const rename = require('gulp-rename');
const access = require('gulp-accessibility');
const w3cjs = require('gulp-w3cjs');

gulp.task('sass', function() {
    return gulp.src(['assets/sass/style.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/sass/'));
});

gulp.task('postcss:dev', ['sass'], function() {
    var processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src('assets/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('assets/css/'))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
});

gulp.task('postcss:prod', ['sass'], function() {
    var processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano({
            safe: true
        })
    ];

    return gulp.src('assets/sass/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('assets/sass/'));
});

gulp.task('watch', function() {
    gulp.watch(['assets/sass/**/*.scss'], ['postcss:dev']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('w3cjs', function() {
    return gulp.src('index.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});


gulp.task('a11y', function() {
    return gulp.src('index.html')
        .pipe(access({
            force: true
        }))
        .on('error', console.log);
});

gulp.task('default', ['postcss:dev', 'browserSync', 'watch']);
gulp.task('prod', ['postcss:prod']);
