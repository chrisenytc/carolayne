/*
 * carolayne
 * https://github.com/chrisenytc/carolayne
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-jsmin'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    mocha = require('gulp-mocha'),
    stylish = require('jshint-stylish');

gulp.task('jshint', function() {
    // Validate All Javascripts
    return gulp.src(['api/**/*.js', 'lib/**/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Compile Stylus
gulp.task('stylus', function() {
    gulp.src('src/styl/**/*.styl')
        .pipe(stylus())
        .pipe(cssmin())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('api/assets/css'));
});

// Minify Javascript
gulp.task('jsmin', function() {
    gulp.src('src/js/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('api/assets/js'));
});

//Concat Application
gulp.task('concat', function() {
  //Main Application
  gulp.src(['src/js/angular/module.js', 'src/js/angular/routes.js', 'src/js/angular/bootstrap.js'])
    .pipe(concat('application.js'))
    .pipe(gulp.dest('api/public'));
  //Controllers
  gulp.src('src/js/angular/controllers/*.js')
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('api/public'));
  //Decorators
  gulp.src('src/js/angular/decorators/*.js')
    .pipe(concat('decorators.js'))
    .pipe(gulp.dest('api/public'));
  //Directives
  gulp.src('src/js/angular/directives/*.js')
    .pipe(concat('directives.js'))
    .pipe(gulp.dest('api/public'));
  //Filters
  gulp.src('src/js/angular/filters/*.js')
    .pipe(concat('filters.js'))
    .pipe(gulp.dest('api/public'));
  //Services
  gulp.src('src/js/angular/services/*.js')
    .pipe(concat('services.js'))
    .pipe(gulp.dest('api/public'));
});

// Minify Javascript
gulp.task('views', function() {
    gulp.src('src/js/angular/views/**/*.html')
        .pipe(gulp.dest('api/public/views'));
});

//Compress images
gulp.task('imagemin', function() {
    gulp.src('src/img/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('api/assets/img'));
    gulp.src('src/imgs/src/**/*.jpg')
        .pipe(imagemin())
        .pipe(gulp.dest('api/assets/img'));
});

// Tests
gulp.task('mocha', function() {
    return gulp.src('test/**/*.js')
        .pipe(mocha({
            globals: ['chai'],
            timeout: 6000,
            ignoreLeaks: false,
            ui: 'bdd',
            reporter: 'spec'
        }));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(['api/**/*.js', 'lib/**/*.js', 'test/**/*.js'], ['jshint']);
    gulp.watch(['api/src/stylus/**/*.styl'], ['stylus']);
    gulp.watch(['api/src/js/**/*.js'], ['jsmin']);
    gulp.watch(['api/src/js/angular/**/*.js'], ['concat']);
});

gulp.task('test', function() {
    gulp.run('mocha', function() {
        process.exit(0);
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['jshint', 'mocha', 'watch']);
// Tasks
gulp.task('buildcss', ['stylus']);
gulp.task('buildjs', ['jsmin', 'concat', 'views', 'imagemin']);
gulp.task('build', ['buildcss', 'buildjs']);
