/*
* Dependencias
*/
var gulp    = require('gulp'),
  webserver = require('gulp-webserver'),
  concat    = require('gulp-concat'),
  uglify    = require('gulp-uglify'),
  stylus    = require('gulp-stylus'),
  nib       = require('nib'),
  minifyCSS = require('gulp-minify-css'),
  jade      = require('gulp-jade'),
  debug     = require('gulp-debug');

/*
* Rutas de los archivos 
*/ 

var paths = {
  css:{
    main  : 'dev/stylus/estilos.styl',
    watch : 'dev/**/*.styl',
    dest  : 'public/css/'
  },
  html:{
    main  : 'dev/index.jade',
    watch : 'dev/**/*.jade',
    dest  : 'public'
  },
  js:{
    main  : 'dev/app.js',
    watch : 'dev/**/*.js',
    dest  : 'public/js/'
  }
};

/*
* Run server
*/
gulp.task('server', function(){  
  gulp.src('./public')
  .pipe(webserver({
    host:'0.0.0.0',
    port: '8081',
    livereload: true
  }))

  var ip = getIpAddress();
  console.log("Server running on:"+ip);
});

/*
* Tarea build-css
*/

gulp.task('build-css', function(){
	gulp.src(paths.css.main)
  .pipe(stylus({
    use: nib(),
    'include css': true
  }))
  .pipe(debug({verbose: true}))
  .pipe(minifyCSS())
  .pipe(gulp.dest(paths.css.dest))
});

/*
* Tarea build-html
*/
gulp.task('build-html', function() {
  return gulp.src(paths.html.main)
  .pipe(jade({
      pretty: true
  }))
  .pipe(debug({verbose: true}))
  .pipe(gulp.dest(paths.html.dest))
});

/*
* Tarea build-js
*/
gulp.task('build-js', function() {
  gulp.src(paths.js.main)
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.js.dest))
});

/*
* Tarea watch
*/

gulp.task('watch', function(){
  gulp.watch(paths.css.watch, ['build-css']);
  gulp.watch(paths.html.watch, ['build-html']);
  gulp.watch(paths.js.watch, ['build-js']);
});

/*
* build all
*/

gulp.task('build', ['build-css','build-html','build-js']);

/*
* Tarea por defecto
*/

gulp.task('default', ['server','watch','build']);


/*
* Para saber la ip
*/

// Local ip address that we're trying to calculate
var address;

// Provides a few basic operating-system related utility functions (built-in)
var os = require('os');
var ifaces = os.networkInterfaces();

function getIpAddress(){  
  for (var dev in ifaces) {

    var iface = ifaces[dev].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) address = iface[0].address;
  }  
  return address;
}