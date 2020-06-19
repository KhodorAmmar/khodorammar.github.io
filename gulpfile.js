const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const access = require("gulp-accessibility");
const w3cjs = require("gulp-w3cjs");

const sassTask = function () {
  return gulp
    .src(["assets/sass/style.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("assets/sass/"));
};

const postcssDev = function () {
  var processors = [autoprefixer()];

  return gulp
    .src("assets/css/*.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("assets/css/"))
    .pipe(
      browserSync.stream({
        match: "**/*.css",
      })
    );
};

const postcssProd = function () {
  var processors = [
    autoprefixer(),
    cssnano(),
  ];

  return gulp
    .src("assets/sass/*.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("assets/sass/"));
};

const watch = function () {
  return gulp.watch(
    ["assets/sass/**/*.scss"],
    gulp.series(sassTask, postcssDev)
  );
};

const browserSyncTask = function (done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
};

const w3cjsTask = function () {
  return gulp.src("index.html").pipe(w3cjs()).pipe(w3cjs.reporter());
};

const a11yTask = function () {
  return gulp
    .src("index.html")
    .pipe(
      access({
        force: true,
      })
    )
    .on("error", console.log);
};

const build = gulp.series(sassTask, postcssDev, browserSyncTask, watch);
const prod = gulp.series(sassTask, postcssProd);

exports.default = build;
exports.prod = prod;
