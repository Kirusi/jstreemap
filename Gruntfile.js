module.exports = function(grunt) {

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            npm_esdoc: {
                command: 'npm run esdoc',
                stdout: true,
                stderr: true
            },
            npm_test: {
                command: 'npm run test',
                stdout: true,
                stderr: true
            }
        },
        watch: {
            doc: {
                files: ['./Gruntfile.js', './package.json', 'src/**/*.js'],
                tasks: ['exec:npm_esdoc'],
                options: {
                    atBegin: true,
                    debounceDelay: 500,
                    reload: true
                }
            },
            test: {
                files: ['./Gruntfile.js', './package.json', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['exec:npm_test'],
                options: {
                    atBegin: true,
                    debounceDelay: 500,
                    reload: true
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};