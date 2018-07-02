var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}
	
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function() {
    return (
    gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
        );
});

gulp.task('js', function() {
    return (
	gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
     );
});

gulp.task('compass', function() {
    return (
	gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
    );
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, gulp.series('coffee'));
  gulp.watch(jsSources, gulp.series('js'));
  gulp.watch('components/sass/*.scss', gulp.series('compass'));
  gulp.watch(htmlSources, gulp.series('html'));
  gulp.watch(jsonSources, gulp.series('json'));
});

gulp.task('connect', function() {
   return (connect.server({
       root: outputDir,
       livereload: true
   })); 
});

gulp.task('html', function() {
  return (gulp.src(htmlSources)
    .pipe(connect.reload()));
});

gulp.task('json', function() {
  return(gulp.src(jsonSources)
    .pipe(connect.reload()));
});

gulp.task('default', gulp.series('json', 'html', 'coffee', 'js', 'compass', gulp.parallel('connect', 'watch')));