module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: "\n",
                banner: "var Hexasphere = (function(){\n\n",
                footer: "\n\nreturn Hexasphere; \n\n})();"
            },
            dist: {
                src: [
                    'src/point.js',
                    'src/face.js',
                    'src/tile.js',
                    'src/hexasphere.js'
                    // 'src/*.js',
                ],
                dest: 'build/<%= pkg.name %>'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            tasks: ['concat'],
            files: ['src/*.js', 'main.js', 'index.html', 'styles.css', 'Gruntfile.js']
        },
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');


};
