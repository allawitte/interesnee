'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	scss = require('gulp-sass'),	
	uglify = require('gulp-uglify'),		
	webserver = require('gulp-webserver'),
	jade = require('gulp-jade'),
	less = require('gulp-less'),
	compass = require('gulp-compass');
	//uncss = require('gulp-uncss');
var YOUR_LOCALS = {};
gulp.task('js', function(){
	gulp.src([
		'bower_components/jquery/dist/jquery.js',		
		'bower_components/bootstrap/dist/js/bootstrap.js'				
		])		
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('build/dev'));

	

	gulp.src([
			'build/dev/app/*.js',
			'build/dev/app/**/*.js',
			'!build/dev/app/**/*_test.js',
			])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('build/dev'));
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src([
  	'build/dev/app/*.jade',
  	'!build/dev/app/template/*.jade'
  	])
    .pipe(jade({
      locals: YOUR_LOCALS,
       pretty: true
    }))
    .pipe(gulp.dest('build/dev'))
});

gulp.task('uncss', function () {
    return gulp.src('build/dev/theme.css')
        .pipe(uncss({
            html: ('build/dev/index.html')
        }))
        .pipe(gulp.dest('build/dev'));
});

gulp.task('compass', function () {
	 gulp.src('build/dev/app/scss')
	 .pipe(compass({
	 	config_file: './config.rb',
	 	css: 'build/dev/app/css',
	 	sass: 'build/dev/app/scss'
	 }))
	 .pipe(concat('app.css'))
	 .pipe(gulp.dest('build/dev'))
});

gulp.task('app', function(){
	gulp.src([
			'build/dev/app/*.js',
			'build/dev/app/**/*.js',
			'!build/dev/app/**/*_test.js',
			])
		.pipe(concat('app.js'))		
		.pipe(gulp.dest('build/dev'));
});

gulp.task('css',function(){

	//gulp.src('build/dev/app/**/*.scss')
    //.pipe(compass());

	gulp.src([
		'bower_components/bootstrap/dist/css/bootstrap.css',
		'bower_components/bootstrap/dist/css/bootstrap-theme.css',		
		'bower_components/font-awesome/css/font-awesome.min.css',		
		])
		.pipe(concat('theme.css'))
		.pipe(gulp.dest('build/dev'));

	

	gulp.src('build/dev/app/**/*.css')
		.pipe(scss())
		.pipe(concat('app.css'))
		//autoprefix
		//minification
		.pipe(gulp.dest('build/dev'));
});

gulp.task('webserver', function(){
	gulp.src('build/dev/')
	.pipe(webserver({
		livereload : true,
		open : true
	}));
});


gulp.task('watch',function(){
	gulp.watch('build/dev/app/**/*.jade', ['templates']);
	gulp.watch('build/dev/app/**/*.js', ['js']);
	gulp.watch('build/dev/app/**/*.scss', ['compass']);
	gulp.watch('build/dev/app/**/*.css', ['css']);
	//gulp.watch('build/dev/app/**/*.*', ['app']);
});
//================  productions tasks  =====================

gulp.task('pjs', function(){
	gulp.src([
		'bower_components/jquery/dist/jquery.js',		
		'bower_components/bootstrap/dist/js/bootstrap.js'
		])
		.pipe(ngAnnotate())
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('build/prod'));

	

	gulp.src([
			'build/dev/app/*.js',
			'build/dev/app/**/*.js',
			'!build/dev/app/**/*_test.js',
			])
		.pipe(ngAnnotate())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/prod'));
});


gulp.task('pcss',function(){
	gulp.src([
		'bower_components/bootstrap/dist/css/bootstrap.min.css',
		'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',		
		])
		.pipe(concat('theme.css'))
		//.pipe(minify())
		.pipe(gulp.dest('build/prod'));

		gulp.src('build/dev/app/**/*.scss')
		.pipe(scss())
		.pipe(concat('app.css'))
		//autoprefix
		//minification
		.pipe(gulp.dest('build/prod'));
});

gulp.task('pwebserver', function(){
	gulp.src('build/prod/')
	.pipe(webserver({
		livereload : true,
		open : true
	}));
});
gulp.task('html', function(){
	gulp.src([
		'build/dev/app/**/*.html',
		'build/dev/*.html'
		])
	.pipe(gulp.dest('build/prod'));
})
gulp.task('pwatch',function(){
	gulp.watch('build/prod/app/**/*.js', ['js']);
	gulp.watch('build/prod/app/**/*.scss', ['css']);
	gulp.watch('build/prod/app/**/*.html', ['phtml']);
})

gulp.task('default', [
	'js',
	'compass',
	'css',
	'templates',
	'watch',
	'webserver'
	]);

gulp.task('prod',[
	'pjs',
	'pcss',
	'html',
	'pwatch',
	'pwebserver',
	])