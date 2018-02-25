var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sh = require('shelljs');
var es = require('event-stream');
var clc = require('cli-color');
var nodemon = require('gulp-nodemon');

var runTimestamp = Math.round(Date.now() / 1000);

gulp.task('default', function (done) {
    // runSequence(function () {
    //     done();
    // });
    done();
});

gulp.task('serve',function(done) {
    runSequence('default', 'nodemon', function() {
        done();
    });
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: './bin/www',
        exec: 'node --inspect --debug=5735'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

function onError(err) {
    gutil.log(err);
    this.emit('end');
}