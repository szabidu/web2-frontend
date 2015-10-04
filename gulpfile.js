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
var templateCache = require('gulp-angular-templatecache');
var rev = require('gulp-rev');
var inject = require('gulp-inject');
var sort = require('gulp-sort');
var uglify = require('gulp-uglify');
var proxy = require('http-proxy-middleware');

var gatoken = process.env.GA_TOKEN;

var sources = {
  'partials': ['./app/partials/**/*'],
  'myscripts' : ["app/scripts/**/*.js"],
  'styles' : ['app/styles/main.scss']
}

gulp.task('views', function () {
  gulp.src(['app/*', '!app/index.html'])
    .pipe(gulp.dest(distDir + '/www'))
    .pipe(connect.reload());

    var options = {
        module: 'tilosApp',
        filename: 'tilos-templates.js',
        transformUrl: function(url) {
            return 'partials/' + url;
        }};

  return gulp.src(sources.partials)
    .pipe(templateCache(options))
    .pipe(rev())
    .pipe(gulp.dest(distDir + '/tmp/'));

});

gulp.task('sass', function(){
    return gulp.src(sources.styles)
        .pipe(sass({style: 'expanded', loadPath: 'app/bower_components'}))
        .pipe(gulp.dest(distDir + '/tmp/'))
})
gulp.task('styles', function() {
    return gulp.src('app/bower_components/angular-growl-v2/build/angular-growl.css')
        .pipe(gulp.dest(distDir + '/tmp/'))


})

gulp.task('inject',  ['views', 'styles', 'sass', 'scripts', 'vendorjs'], function () {


    // inject
    var resources = gulp.src([distDir + '/tmp/*.css',distDir + '/tmp/*.js'])
        .pipe(sort())
        .pipe(gulp.dest(distDir + '/www'));


    gulp.src('app/index.html')
        .pipe(replace(/GA_TOKEN/g,gatoken))
        .pipe(inject(resources, {relative: true, ignorePath: '../dist/www/'}))
        .pipe(gulp.dest(distDir + "/www"))
        .pipe(connect.reload());
});


gulp.task('scripts', function () {
    return gulp.src(sources.myscripts)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('tilos.js'))
        .pipe(rev())
        .pipe(gulp.dest(distDir + "/tmp/"));
});

gulp.task('vendorjs', function () {
  return gulp.src([
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
    'app/bower_components/satellizer/satellizer.js',
    'app/bower_components/angular-growl-v2/build/angular-growl.js'
  ])
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distDir + "/www/scripts"))
    .pipe(connect.reload());
});


gulp.task('assets', function () {
    gulp.src([
      'app/nr.js',
      'app/template/**/*',
      'app/images/**/*',
      'app/doc/**/*',
      'app/fonts/**',
      'app/jplayer/**/*'],
    {base: 'app'})
    .pipe(gulp.dest(distDir + '/www'))
    .pipe(connect.reload());
    gulp.src('apidoc/**/*.*')
    .pipe(gulp.dest(distDir + '/www/apidoc'))
    .pipe(connect.reload());

    gulp.src([
            'app/bower_components/sass-bootstrap/fonts/**'],
        {base: 'app/bower_components/sass-bootstrap/fonts'})
        .pipe(gulp.dest(distDir + '/www/fonts'))
        .pipe(connect.reload());

});

gulp.task('chat', function () {
  gulp.src(['chat/**/*'], {base: '.'})
    .pipe(gulp.dest(distDir + '/www'))
    .pipe(connect.reload());
});



gulp.task('bower_components', function () {
  gulp.src(['app/bower_components/**/*'], {base: 'app'})
    .pipe(gulp.dest(distDir + '/www'))
    .pipe(connect.reload());
});


gulp.task('clean', function () {
  return gulp.src([distDir], {read: false})
    .pipe(clean());
});


gulp.task('build', ['clean'], function () {
    gulp.start('all','inject');
});

gulp.task('default', ['clean'], function () {
  gulp.start('all');
});

gulp.task('all', ['assets', 'chat', 'bower_components'], function(){

});

;


gulp.task('zip', function (cb) {
  exec.exec('zip -q -r frontend.zip dist', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('watch', function () {
  gulp.watch(['app/index.html',
              sources.styles,
              sources.partials,
              sources.myscripts],['inject']);
});

gulp.task('connect', function () {
  connect.server({
    root: [distDir + '/www'],
    port: 9000,
    livereload: true,
    middleware: function(connect, opt) {
      return [
        proxy('/api', {
          target: 'https://tilos.hu',
          changeOrigin:true
        })
      ]
    }
  });
});

gulp.task('server', ['connect', 'watch'], function () {
});
