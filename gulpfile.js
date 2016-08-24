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
var sass = require('gulp-sass');
var stripCssComments = require('gulp-strip-css-comments');
var removeEmptyLines = require('gulp-remove-empty-lines');

gulp.task('rev', ['sass','cssMin', 'jsMin', 'deltmp'], function() {



	return gulp.src('app/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app'));

});
gulp.task('copycss', function() {
	 gulp.src('app/css/*.css')
		.pipe(gulp.dest('app/js/css/'));

	 gulp.src(['app/css/globe.css','app/css/app.css'])
		.pipe(gulp.dest('app/wechatpay/css/'));//

	 gulp.src('app/js/util.js')
		.pipe(gulp.dest('app/wechatpay/js/'));

	return gulp.src('app/css/*.css')
		.pipe(gulp.dest('app/partials/css/'));
});



gulp.task('addVersion', ['copycss'], function() {

	  gulp.src('app/js/*.js')
		.pipe(rev())
		.pipe(gulp.dest('app/js'));//app.js里引用了版本号，所以需要加上版本号


	gulp.src('app/wechatpay/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app/wechatpay'));
		
	return gulp.src('app/partials/*.html')
		.pipe(rev())
		.pipe(gulp.dest('app/partials'));

		/**/

	//del(['app/partials/css/']);
	//gulp.src('app/partials/css', {read: false})
	//  .pipe(clean());
});

gulp.task('sass', function () {
  return gulp.src('./app/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(stripCssComments())
    .pipe(removeEmptyLines())
    .pipe(gulp.dest('./app/css'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./app/sass/*.scss', ['sass']);
});

gulp.task('deltmp', ['addVersion'], function() {
	//del(['app/partials/css/']);

	gulp.src('app/js/css', {
		read: false
	}).pipe(clean({
		force: true
	}));

	gulp.src('app/wechatpay/css', {
		read: false
	}).pipe(clean({
		force: true
	}));

	gulp.src('app/wechatpay/js', {
		read: false
	}).pipe(clean({
		force: true
	}));

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
			'app/css/angular-busy.min.css',
			'app/wx_bx_gl/css/swiper.min.css',
			'app/bower_components/rangeslider.js/dist/rangeslider.css',
			'app/js/lcalendar/dist/css/LCalendar.min.css'
		], {
			base: 'app/'
		}).pipe(cleanCSS())
		.pipe(concat('application.min.css'))
		.pipe(gulp.dest('app/css/output'))
})
gulp.task('jsMin', function() {
	return gulp.src([
			'app/bower_components/jquery/dist/jquery.min.js',
			//'app/js/lcalendar/dist/js/LCalendar.js',
			'app/js/fastclick.js',
			'app/js/iscroll.js',
			'app/bower_components/underscore/underscore-min.js',
			'app/bower_components/angular/angular.min.js',
			'app/bower_components/angular-route/angular-route.min.js',
			'app/js/angular-busy.min.js',
			'app/bower_components/angular-route-styles/route-styles.js',
			'app/bower_components/rangeslider.js/dist/rangeslider.min.js',
			'app/wx_bx_gl/js/swiper.min.js',
			'app/js/util.js',
			'app/js/app.js',
			'app/js/main_controllers.js',
			'app/js/temai_controllers.js',
			'app/js/baodan_management_controller.js',
			'app/js/service_controllers.js',
			'app/js/transaction_controllers.js',
			'app/js/auto_promote_controllers.js'
			// 'app/js/jquery.piemenu.js'
			
			/**/

		], {
			base: 'app/'
		})
		.pipe(concat('application.js'))
		.pipe(gp_rename('application.min.js'))
		.pipe(gp_sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest('app/js/output'));
});




gulp.task('wx_sass', function () {
  return gulp.src('./app/sass/wx_share/*.scss')
    .pipe(sass().on('error', sass.logError))
     .pipe(stripCssComments())
    .pipe(gulp.dest('./app/wx_share/css'));
});
gulp.task('wx_sass:watch', function () {
  gulp.watch('./app/sass/wx_share/*.scss', ['wx_sass']);
});


gulp.task('wx_rev', ['wx_cssMin', 'wx_jsMin','wx_deltmp'], function() {
	gulp.src('app/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app'));
});
gulp.task('wx_copycss', function() {
	return gulp.src('app/wx_share/css/*.css')
		.pipe(gulp.dest('app/wx_share/partials/wx_share/css/'));
});

gulp.task('wx_add_version', ['wx_copycss'], function() {
	return gulp.src('app/wx_share/partials/*.html')
		.pipe(debug())
		.pipe(rev())
		.pipe(gulp.dest('app/wx_share/partials'));

});
gulp.task('wx_deltmp', ['wx_add_version'], function() {
	//del(['app/partials/css/']);
	return gulp.src('app/wx_share/partials/wx_share', {
		read: false
	}).pipe(clean({
		force: true
	}));
	//gulp.src('app/partials/css', {read: false}).pipe(clean());
})

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
			'app/js/util.js',
			'app/bower_components/jquery/dist/jquery.min.js',
			'app/bower_components/angular/angular.min.js',
			'app/bower_components/angular-route-styles/route-styles.js',
			'app/bower_components/angular-route/angular-route.min.js',
			'app/bower_components/angular-resource/angular-resource.min.js',
			'app/wx_share/js/app.js',
			'app/wx_share/js/controllers.js',
			'app/wx_share/js/directives.js'

		], {
			base: 'app/'
		})
		.pipe(concat('wx_application.js'))
		.pipe(gp_rename('wx_application.min.js'))
		.pipe(gp_sourcemaps.init())
		.pipe(uglify())
		.pipe(gulp.dest('app/wx_share/js/output'));
});