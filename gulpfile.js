var gulp = require("gulp");
var watchLess = require("gulp-watch-less");
var less = require("gulp-less");
var bg = require("gulp-bg");
var Server = require("karma").Server;
var concat = require("gulp-concat");
var webpack = require("gulp-webpack");
var autoprefixer = require("gulp-autoprefixer");
var nightwatch = require("gulp-nightwatch");
var lessSrc = "dashboard/static/css/app.less";
var lessDest = "dashboard/static/css";

gulp.task("server", bg("python", "manage.py", "runserver", "0.0.0.0:8000"));
gulp.task("worker", bg("celery", "-A", "vaccines.celery", "worker", "--loglevel=INFO", "--concurrency=6"));
gulp.task("monitor", bg("celery", "flower", "-A", "vaccines.celery", "--address=127.0.0.1", "--port=5555"));
gulp.task("djangotest", bg("python", "manage.py", "test"));

gulp.task("default", ["server", "worker"], function() {
    return gulp.src(lessSrc)
        .pipe(watchLess(lessSrc, function() {
            gulp.start("less");
        }));
});

gulp.task("scripts", function() {
    return gulp.src("dashboard/static/js/**/*.js")
        .pipe(concat("app.js"))
        .pipe(gulp.dest("dashboard/static/dist/"));
});

gulp.task("less", function() {
    return gulp.src(lessSrc)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(gulp.dest(lessDest));
});

gulp.task("karma", function(done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("test", ["djangotest"], function(done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("tdd", function(done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: false
    }, done).start();
});

gulp.task("pack", function() {
    return gulp.src("src/entry.js")
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest("dashboard/static/dist"));
});



gulp.task("ft", function() {
    return gulp.src("")
        .pipe(
            nightwatch({
                configFile: "ft/nightwatch.json"
            })
        );
});