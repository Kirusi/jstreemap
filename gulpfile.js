// grab our gulp packages
const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const { exec, spawn, spawnSync, execSync } = require('child_process');

function runCmd(taskName, cmd) {
    try {
        execSync(cmd, {stdio: [0, 1, 2]});
    }
    catch (error) {
        throw new gutil.PluginError({
            plugin: taskName,
            message: error.message
        });
    }
}

gulp.task('eslint', function() {
    runCmd('eslint', 'npm run eslint-fix');
});

gulp.task('dev-test', ['eslint'], function() {
    runCmd('dev-test', 'npm run dev-test');
});

gulp.task('esdoc', ['dev-test'], function() {
    runCmd('esdoc', 'npm run esdoc');
});

gulp.task('webpack', ['esdoc'], function() {
    runCmd('webpack', 'npm run webpack');
});

gulp.task('prod-test', ['webpack'], function() {
    runCmd('prod-test', 'npm run prod-test');
});

gulp.task('build', ['prod-test'], function() {
    return gutil.log('Build is complete.');
});

gulp.task('default', ['build', 'watch'], function() {
    return gutil.log('Default task is complete.');
});

gulp.task('watch', function() {
    gulp.watch(['src/**/*.js', 'test/**/*.js', 'gulpfile.js', 'package.json'], ['build']);
});