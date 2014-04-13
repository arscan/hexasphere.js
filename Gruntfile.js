module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            'build/<%= pkg.name %>': ['browserify.js']
        },
        watch: {
            options: {
                livereload: true
            },
            tasks: ['browserify'],
            files: ['src/*.js', 'main.js', 'browserify.js', 'index.html', 'styles.css', 'Gruntfile.js']
        },
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');


};
