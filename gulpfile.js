var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var gulp = require('gulp')

//这个可以让express启动
gulp.task("node", function() {
    nodemon({
        script: './app.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'http://localhost:3000'
        }
    })
});


gulp.task('server', ["node"], function() {
    var files = [
        'views/**/*.html',
        'public/**/*.*'
    ];

    //gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: false,
        port: 3000 //这个是browserSync对http://localhost:3000实现的代理端口
    });

    gulp.watch(files).on("change", reload);
});