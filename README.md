# gulp
## gulp 环境搭建
#### 1. 安装gulp

```
cnpm i -g gulp  //安装全局gulp
```
#### 2.gulp Api 学习
```
    var gulp = requrie('gulp'); //引入gulp
    
    gulp.task('taskName',['task1', 'task2', ...],function(){
        gulp.src('fileSrc',[,opts]) //gulp.src文件路径可为路径字符串的数组，opts(可选)
            .pipe(fn()) //执行
            .pipe(gulp.dest('destSrc',[,opts]))//gulp.dest文件写入路径，opts(可选)
    });/*
        gulp.task 有三个参数：
        1.任务名称；(必填)
        2.按顺序异步执行任务数组；（可选）
        3.任务执行函数，等数组内任务执行完后再执行;（必填）
        */
    gulp.task('watch',function(){
       gulp.watch(['fileSrc1',...],[,opts],['task1',...],function(evt){
           
       }) 
        /*
          gulp.watch 有四个参数：
          1.需要监听的文件；（必填）
          2.opts；（可选）
          3.tasks；（可选，3. 4.必须填一个）
          4.cb(evt)；(可选)
        */
    })
    
```
#### 3.npm 初始化和依赖包安装
```
cnpm init 
cnpm i --save-dev gulp
//一些依赖包和版本号如下
    "babel-preset-es2015": "^6.24.1",//babel标准es2015
    "babel-preset-stage-0": "^6.24.1",//es7以及以上
    "browserify": "^14.4.0", //打包工具
    "babelify": "^7.3.0", //用于打包时用
    "gulp": "^3.9.1",
    "gulp-babel": "^6.1.2", //babel
    "gulp-clean": "^0.3.2", //用于清理文件
    "gulp-concat": "^2.6.1", //合并文件
    "gulp-cssnano": "^2.1.2", //压缩css
    "gulp-livereload": "^3.8.1", //自动刷新页面
    "gulp-rename": "^1.2.2", //重命名
    "gulp-sass": "^3.1.0", //sass
    "gulp-uglify": "^3.0.0", //压缩丑化js
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0"

cnpm i --save 
//版本控制依赖
    "gulp-rev": "^7.1.2",
    "gulp-rev-collector": "^1.2.2",
```

#### 4.配置gulpfile
```
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


gulp.task('testRev',function() {
	return gulp.src(['dist/rev/**/*.json','app/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('dist'));

});

// 打包
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

// 监视文件变化，自动执行任务
gulp.task('watch', function(){
  	gulp.watch(['app/css/*.css','app/css/*.scss'], ['convertCSS']);
  	gulp.watch(['app/js/*.js'], ['convertJS'];
});

gulp.task('min', ['convertCSS', 'convertJS']);

// 执行 gulp clean 
// gulp min
// gulp testRev

```
##### 问题：gulp异步执行和执行顺序需要思考

#### 5.文件目录结构

```
//执行前
├── app
│   ├── app.html
│   ├── css
│   │   ├── app.css
│   │   └── style.scss
│   ├── index.html
│   └── js
│       ├── app.js
│       ├── bbb.js
│       └── ccc.js
├── dist
│   ├── css
│   └── js
├── gulpfile.js
└── package.json
//执行后

├── app
│   ├── app.html
│   ├── css
│   │   ├── app.css
│   │   └── style.scss
│   ├── index.html
│   └── js
│       ├── app.js
│       ├── bbb.js
│       └── ccc.js
├── dist
│   ├── app.html
│   ├── css
│   │   └── app-186b633846.css
│   ├── index.html
│   ├── js
│   │   ├── app-63eba027ee.js
│   │   ├── bbb-d070049c74.js
│   │   └── ccc-903a18ed22.js
│   └── rev
│       ├── css
│       │   └── rev-manifest.json
│       └── js
│           └── rev-manifest.json
├── gulpfile.js
└── package.json

```

