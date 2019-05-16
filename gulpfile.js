var gulp = require('gulp');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');      //压缩图片
const browserSync = require('browser-sync');  //开启服务
var concat = require('gulp-concat');//合并文件 --合并只是放一起--压缩才会真正合并相同样式
const reload = browserSync.reload;           
// var reload = require('reload');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀
const cleanCSS = require('gulp-clean-css');      // 压缩css文件，减小文件大小，并给引用url添加版本号避免缓存。
var del = require('del');                        // 删除
var less = require('gulp-less');                 // less自动编译css

gulp.task('watch', cb => {
  // 在下面的任务js、less、html中，都会执行文件的预处理以及页面的热启动
  gulp.watch('./src/js/*.js', gulp.series('js'));

  gulp.watch('./src/css/*.less', gulp.series('less'));

  gulp.watch('./src/img/**.*', gulp.series('img'));
  gulp.watch(['./src/page/*.html', './src/template/**/*'], gulp.series('html'));
  cb();
});

gulp.task('img', () => {
  return gulp.src(['./src/img/**.*'])
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/img/'))
      .pipe(
          reload({
              stream: true
          })
      );
});

gulp.task('js', cb => {
  return (
    gulp.src(['./src/js/*.js'])
      // .pipe(uglify())
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(
        reload({
            stream: true
        })
      )
  );
});

const lessStyle = () => {
  return gulp.src(['./src/css/*.less', '!./src/css/_*.less'])
      .pipe(less())
      .pipe(
          autoprefixer({
              browsers: ['last 2 versions']
          })
      )
      .pipe(cleanCSS())
      .pipe(concat('main.css')) //合并css
      .pipe(gulp.dest('./dist/css/'))
      .pipe(
          reload({
              stream: true
          })
      );
};
const cssStyle = () => {
  return gulp.src(['./src/css/*.css'])
      .pipe(cleanCSS())
      .pipe(gulp.dest('./dist/css/'))
      .pipe(
          reload({
              stream: true
          })
      );
};
gulp.task('less',
  gulp.series(cssStyle, lessStyle)
);

gulp.task('html', cb => {
  return (
    gulp.src(['./src/page/*.html'])
      .pipe(fileinclude({
        prefix: '<!--@',
        suffix: '-->',
        indent: true,
        basepath: './src/template'
    }))
      .pipe(gulp.dest('./dist/page/'))
      .pipe(
        reload({
            stream: true
        })
      )
  );
});

gulp.task('clean', cb => {
  // return gulp.gulp.src(['dist/css/', 'dist/js/'])
  //     .pipe(clean({allowEmpty: true}));
  return del(['dist/css/*.css', 'dist/js/*.js', 'dist/page/*.html']);
});

gulp.task('browserSync', cb => {
  browserSync({
      server: {
          baseDir: ['./dist/']
      }
  });
});


gulp.task(
  'default',
  gulp.series('clean', 'less', 'js', 'img', 'html', 'watch', 'browserSync')
);

