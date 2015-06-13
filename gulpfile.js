var distDir = 'dist';
var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var exec = require('child_process');
var replace = require('gulp-replace');
var watch = require('gulp-watch');

var gatoken = process.env.GA_TOKEN;

var sources = {
  'partials': ['./app/partials/**/*'],
  'myscripts' : ["app/scripts/**/*.js"]
}

gulp.task('views', function () {
  gulp.src(['app/*', '!app/index.html'])
    .pipe(gulp.dest(distDir + '/www'));

  gulp.src(sources.partials)
    .pipe(gulp.dest(distDir + '/www/partials/'));

  gulp.src('app/index.html')
    .pipe(replace(/GA_TOKEN/g,gatoken))
    .pipe(gulp.dest(distDir + "/www"));
});


gulp.task('scripts', function () {
  gulp.src(sources.myscripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('tilos.js'))
    .pipe(gulp.dest(distDir + "/www/scripts"));

  gulp.src([
    "app/bower_components/angular/angular.js",
    "app/bower_components/angular-route/angular-route.js",
    "app/bower_components/angular-resource/angular-resource.js",
    "app/bower_components/angular-sanitize/angular-sanitize.js",
    "app/bower_components/textAngular/textAngular.js",
    "app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap.js",
    "app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
    "app/bower_components/angular-ui-router/release/angular-ui-router.js",
    "app/bower_components/angular-local-storage/dist/angular-local-storage.js",
    "app/bower_components/angular-recaptcha/release/angular-recaptcha.min.js",
    'app/bower_components/angularitics/src/angulartics.js',
    'app/bower_components/angularitics/src/angulartics-ga.js',
    'app/bower_components/angular-easyfb/angular-easyfb.min.js',
    'app/bower_components/satellizer/satellizer.js'
  ])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest(distDir + "/www/scripts"));
});


gulp.task('assets', function () {
    gulp.src([
      'app/nr.js',
      'app/template/**/*',
      'app/images/**/*',
      'app/styles/fonts/**',
      'app/jplayer/**/*'],
    {base: 'app'})
    .pipe(gulp.dest(distDir + '/www'));
    gulp.src('apidoc/**/*.*')
    .pipe(gulp.dest(distDir + '/www/apidoc'));

    gulp.src([
            'app/bower_components/sass-bootstrap/fonts/**'],
        {base: 'app/bower_components/sass-bootstrap/fonts'})
        .pipe(gulp.dest(distDir + '/www/styles/fonts'));

});

gulp.task('chat', function () {
  gulp.src(['chat/**/*'], {base: '.'})
    .pipe(gulp.dest(distDir + '/www'));
});



gulp.task('bower_components', function () {
  gulp.src(['app/bower_components/**/*'], {base: 'app'})
    .pipe(gulp.dest(distDir + '/www'));
});


gulp.task('clean', function () {
  return gulp.src([distDir], {read: false})
    .pipe(clean());
});


gulp.task('build', ['clean'], function () {
  gulp.start('default');
});

gulp.task('default', function () {
  gulp.start('sass', 'scripts', 'assets', 'chat', 'bower_components', 'views');
});


gulp.task('sass', function () {
  return gulp.src('app/styles/main.scss')
    .pipe(sass({style: 'compressed', loadPath: 'app/bower_components'}))
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(distDir + '/www/styles'))
});


gulp.task('zip', function (cb) {
  exec.exec('zip -q -r frontend.zip dist', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('watch', function () {
  gulp.watch(sources.partials, function (event) {
    gulp.start('views');
  });
  gulp.watch(sources.myscripts, function (event) {
    gulp.start('scripts');
  });
});


gulp.task('connect', function () {
  connect.server({
    root: [distDir + '/www'],
    port: 9000,
    livereload: true
  });
});

gulp.task('server', ['connect', 'watch'], function () {
});
