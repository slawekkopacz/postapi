﻿var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

const paths = {
  js: ['./**/*.js', '!node_modules/**'],
  tests: ['./tests/**/*.js'],
};

gulp.task('lint', () => {
  return gulp.src(paths.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
    .once('end', () => {
      plugins.util.log('lint task completed.');
      process.exit(0);
    });
});

gulp.task('set-env-test', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test',
      //https_proxy: 'http://127.0.0.1:8888',
      //http_proxy: 'http://127.0.0.1:8888',
      //NODE_TLS_REJECT_UNAUTHORIZED: '0',
    }
  });
});

gulp.task('mocha', ['set-env-test'], () => {

  return gulp.src(paths.tests, { read: false })
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: plugins.util.env['mocha-reporter'] || 'spec',
    }))
    .once('error', (err) => {
      plugins.util.log(err);
      process.exit(1);
    })
    .once('end', () => {
      process.exit(0);
    });
});

gulp.task('setup-dev', () => {
  return require('./setup/import');
});


//gulp.task('default', ['lint', 'mocha'], function () {
//  plugins.util.log('default task(s) completed.');
//});