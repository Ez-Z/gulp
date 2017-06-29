const gulp = require('gulp');

const babel = require('gulp-babel');

const babelify = require('babelify');

const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');

const browserify = require('browserify'); //打包
const source = require('vinyl-source-stream'); //

const sass = require('gulp-sass'); //sass 依赖

const livereload  = require('gulp-livereload'); //文件改变刷新页面

const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');

const clean = require('gulp-clean');

//清除文件
gulp.task('clean', function(){
  return gulp.src(['dist/js/','dist/css/','dist/*.html','dist/rev'])
    .pipe(clean());
});

// 编译并压缩js rev
gulp.task('convertJS', function(){
  gulp.src(['app/js/**/*.js'])
    .pipe(babel({
      presets: ['es2015','stage-0']
    }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'))
});

// 合并并压缩css rev
gulp.task('convertCSS', function(){
  gulp.src(['app/css/*.css','app/css/*.scss'])
	.pipe(sass().on('error', sass.logError))
	.pipe(concat('app.css'))
	.pipe(cssnano())
	.pipe(rev())
	.pipe(gulp.dest('dist/css'))
	.pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

// browserify
// gulp.task("browserify", function () {
// 	var b = browserify({
// 		entries: "app/js/app.js"
// 	});

// 	return b.transform(babelify, {  //此处babel的各配置项格式与.babelrc文件相同
// 		  presets: [
// 			'es2015',  //转换es6代码
// 			'stage-0',  //指定转换es7代码的语法提案阶段
// 		  ]
// 		})
// 		.bundle()
// 		.pipe(source("app.js"))
// 		.pipe(gulp.dest("dist/js"))
// 		// .pipe(livereload()); //每次打包刷新页面
// });

gulp.task('testRev',function() {
	return gulp.src(['dist/rev/**/*.json','app/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('dist'));

});

// gulp.task("build", function () {
// 	var b = browserify({
// 		entries: "app/js/app.js"
// 	});

// 	return b.transform(babelify, {  //此处babel的各配置项格式与.babelrc文件相同
// 		  presets: [
// 			'es2015',  //转换es6代码
// 			'stage-0',  //指定转换es7代码的语法提案阶段
// 		  ]
// 		})
// 		.bundle()
// 		.pipe(source("app.js"))
// 		.pipe(buffer())
// 		.pipe(sourcemaps.init())
// 		.pipe(uglify())
// 		.pipe(sourcemaps.write('./maps'))
// 		.pipe(gulp.dest("dist/js"));
// });

// gulp.task('lint',function() {
// 	gulp.src('app/js/**/*.js')
// 		.pipe(eslint({
// 			configFile: "./.eslintrc"
// 		}))
// })

// 监视文件变化，自动执行任务
gulp.task('watch', function(){
  	gulp.watch(['app/css/*.css','app/css/*.scss'], ['convertCSS']);
  	gulp.watch(['app/js/*.js'], ['convertJS']);
});

gulp.task('min', ['convertCSS', 'convertJS'],function(){
	
});

