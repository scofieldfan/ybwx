var gulp = require('gulp');
var cssver = require('gulp-make-css-url-version')
var debug = require('gulp-debug');
var rev = require('gulp-rev-append');
var del = require('del');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var gp_rename = require('gulp-rename');
var gp_sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var wait = require('gulp-wait');
var clean = require('gulp-clean');

gulp.task('rev', ['cssMin', 'jsMin', 'deltmp'], function() {
	gulp.src('app/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app'));

});
gulp.task('copycss', function() {
	return gulp.src('app/css/*.css')
		.pipe(gulp.dest('app/partials/css/'));
});

gulp.task('test', ['copycss'], function() {
	return gulp.src('app/partials/*.html')
		.pipe(rev())
		.pipe(gulp.dest('app/partials'));
	//del(['app/partials/css/']);
	//gulp.src('app/partials/css', {read: false})
	//  .pipe(clean());
});
gulp.task('deltmp', ['test'], function() {
	//del(['app/partials/css/']);
	return gulp.src('app/partials/css', {
		read: false
	}).pipe(clean({
		force: true
	}));
	//gulp.src('app/partials/css', {read: false}).pipe(clean());
})

gulp.task('cssMin', function() {
	return gulp.src([
			'app/css/normalize.css',
			'app/css/share.css',
			'app/css/globe.css',
			'app/css/app.css',
			'app/css/angular-busy.min.css'
		], {
			base: 'app/'
		}).pipe(cleanCSS())
		.pipe(concat('application.min.css'))
		.pipe(gulp.dest('app/css/output'))
})
gulp.task('jsMin', function() {
	return gulp.src([
			'app/bower_components/jquery/dist/jquery.min.js',
			'app/bower_components/underscore/underscore-min.js',
			'app/bower_components/angular/angular.min.js',
			'app/bower_components/angular-route/angular-route.min.js',
			'app/bower_components/angular-cookies/angular-cookies.min.js',
			'app/bower_components/angular-resource/angular-resource.min.js'
			/*
			'app/js/util.js'
			
			'app/js/app.js',
			'app/js/main_controllers.js',
			'app/js/temai_controllers.js',
			'app/js/directives.js',
			'app/js/jquery.piemenu.js',
			'app/js/angular-busy.min.js'*/

		], {
			base: 'app/'
		})
		.pipe(concat('application.js'))
		.pipe(gp_rename('application.min.js'))
		.pipe(gp_sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest('app/js/output'));
});


gulp.task('wx_rev', ['wx_cssMin', 'wx_jsMin'], function() {
	gulp.src('app/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app'));
});

gulp.task('wx_cssMin', function() {
	return gulp.src([
			'app/bower_components/normalize-css/normalize.css',
			'app/wx_share/css/style.css'
		], {
			base: 'app/'
		}).pipe(cleanCSS())
		.pipe(concat('wx_share.min.css'))
		.pipe(gulp.dest('app/wx_share/css'))
})
gulp.task('wx_jsMin', function() {
	return gulp.src([
			'app/wx_share/js/util.js',
			'app/bower_components/jquery/dist/jquery.min.js',
			'app/bower_components/angular/angular.min.js',
			'app/bower_components/angular-route/angular-route.min.js',
			'app/bower_components/angular-cookies/angular-cookies.min.js',
			'app/bower_components/angular-resource/angular-resource.min.js',
			'app/wx_share/js/app.js',
			'app/wx_share/js/controllers.js',
			'app/wx_share/js/directives.js',
			'app/wx_share/js/wxShare.js'

		], {
			base: 'app/'
		})
		.pipe(concat('wx_application.js'))
		.pipe(gp_rename('wx_application.min.js'))
		.pipe(gp_sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest('app/wx_share/js/output'));
});